const { UserInputError } = require('apollo-server-express');
const { mustBeSingedIn } = require('./auth.js');
const { getDb, getNextSequence } = require('./db.js');

function validate(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', {
      errors,
    });
  }
}

const PAGE_SIZE = 10;

async function list(_, { status, effortMin, effortMax, search, page }) {
  const db = getDb();
  const filter = {};
  if (status) filter.status = status;

  if (effortMin || effortMax) {
    filter.effort = {};
    if (effortMin) filter.effort.$gte = effortMin;
    if (effortMax) filter.effort.$lte = effortMax;
  }

  if (search) filter.$text = { $search: search };

  const cursor = await db
    .collection('issue')
    .find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const issues = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { issues, pages };
}

async function add(_, { issue }) {
  validate(issue);
  const db = getDb();
  const newIssue = Object.assign({}, issue);
  newIssue.id = await getNextSequence('issue');
  newIssue.created = new Date();

  if (newIssue.status === undefined) newIssue.status = 'New';
  const result = await db.collection('issue').insertOne(newIssue);
  const savedIssue = await db.collection('issue').findOne({
    _id: result.insertedId,
  });
  return savedIssue;
}

async function get(_, { id }) {
  const db = getDb();
  const issue = await db.collection('issue').findOne({ id });
  return issue;
}

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.title || changes.owner || changes.status) {
    const issue = await db.collection('issue').findOne({ id });
    Object.assign(issue, changes);
    validate(issue);
  }
  await db.collection('issue').updateOne({ id }, { $set: changes });
  const savedIssue = db.collection('issue').findOne({ id });
  return savedIssue;
}

async function remove(_, { id }) {
  const db = getDb();
  const issue = await db.collection('issue').findOne({ id });
  if (!issue) return false;

  let result = await db.collection('deleted_issue').insertOne(issue);
  if (result.insertedId) {
    result = await db.collection('issue').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function restore(_, { id }) {
  const db = getDb();
  const issue = await db.collection('deleted_issue').findOne({ id });
  if (!issue) return false;

  let result = await db.collection('issue').insertOne(issue);
  if (result.insertedId) {
    result = await db.collection('deleted_issue').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function counts(_, { status, effortMin, effortMax }) {
  const db = getDb();
  const filter = {};
  // if (status) filter.status = status;
  if (effortMin || effortMax) {
    filter.effort = {};
    if (effortMin) filter.effort.$gte = effortMin;
    if (effortMax) filter.effort.$lte = effortMax;
  }

  const results = await db
    .collection('issue')
    .aggregate([
      // { $match: filter },
      {
        $group: {
          _id: { owner: '$owner', status: '$status' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.owner': 1 },
      },
    ])
    .toArray();
  const stats = {};
  results.forEach(result => {
    //eslint-disable-next-line no-underscore-dangle
    const { owner, status: statusKey } = result._id;
    if (!stats[owner]) stats[owner] = { owner };
    stats[owner][statusKey] = result.count;
  });
  const filteredStatus = status
    ? Object.values(stats).filter(stat => stat[status])
    : Object.values(stats);
  return filteredStatus;
}

module.exports = {
  list,
  get,
  counts,
  add: mustBeSingedIn(add),
  update: mustBeSingedIn(update),
  restore: mustBeSingedIn(restore),
  delete: mustBeSingedIn(remove),
};
