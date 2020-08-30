/* global db print */
/* eslint no-restricted-globals: "off" */

db.issue.remove({});
db.deleted_issue.remove({});
const issuesDBInit = [
  {
    id: 1,
    status: 'New',
    owner: 'Raven',
    effort: 5,
    created: new Date('2019-01-15'),
    due: undefined,
    title: 'Error in console when clicking Add',
    description:
      'Steps to recreate the problem:' +
      '\n1. Refresh the browser.' +
      '\n2. Select "New" in the filter' +
      '\n3. Refresh the browser again. Note the warning in the console:' +
      '\n   Warning: Hash history cannot PUSH the same path; a new entry' +
      '\n   will not be added to the history stack' +
      '\n4. Click on Add.' +
      "\n5. There is an error in console, and add doesn't work.",
  },
  {
    id: 2,
    status: 'Assigned',
    owner: 'Eddie',
    effort: 14,
    created: new Date('2019-01-16'),
    due: new Date('2019-02-01'),
    title: 'Id ex est eiusmod sint eiusmod magna minim in dolor quis esse.',
    description:
      'Officia amet ullamco eiusmod ut cillum duis Lorem est commodo deserunt anim.' +
      '\nLaborum tempor et in do.' +
      '\nNostrud dolore veniam quis enim commodo sint quis minim anim voluptate consequat minim.',
  },
  {
    id: 3,
    status: 'Fixed',
    owner: 'NuA',
    effort: 42,
    created: new Date('2019-02-16'),
    due: new Date('2019-06-30'),
    title: 'Enim est ratione.',
    description: 'Commodo ipsum deserunt laborum magna magna.',
  },
  {
    id: 4,
    status: 'Assigned',
    owner: 'Eddie',
    effort: 10,
    created: new Date('2019-03-21'),
    due: new Date('2019-05-19'),
    title: 'Dolor facilis harum totam ad dolorem qui culpa.',
    description:
      'Nisi proident tempor sint commodo et fugiat pariatur mollit reprehenderit exercitation quis veniam veniam.',
  },
  {
    id: 5,
    status: 'Fixed',
    owner: 'Alexie',
    effort: 19,
    created: new Date('2019-02-10'),
    due: new Date('2019-06-01'),
    title: 'Cupidatat eu amet ea nisi magna ad ad est ullamco consequat eu.',
    description:
      'Nostrud esse adipisicing dolor in aliquip deserunt duis.' +
      '\nExcepteur sint id ut consequat duis cillum in.' +
      '\nAdipisicing eiusmod est deserunt elit Lorem laboris dolore anim excepteur elit pariatur qui est ullamco.' +
      '\nTempor culpa ullamco quis velit reprehenderit laboris quis veniam enim quis do labore consectetur.' +
      '\nAliquip officia ex dolor ad occaecat elit sint elit cillum consequat deserunt consectetur cupidatat.' +
      '\nLaborum proident ex esse id mollit laboris laborum.',
  },
  {
    id: 6,
    status: 'New',
    owner: 'Dante',
    // effort: 31,
    created: new Date('2019-02-16'),
    due: new Date('2019-06-01'),
    title: 'Missing bottom border on panel',
    description:
      'Ullamco minim ullamco dolore sunt non nostrud aliquip ea adipisicing nisi ex do.',
  },
  {
    id: 7,
    status: 'Closed',
    owner: 'Rita',
    effort: 17,
    created: new Date('2020-01-11'),
    due: new Date('2020-02-01'),
    title: 'Reprehenderit mollit fugiat fugiat deserunt do.',
    description:
      'Dolore adipisicing ipsum cillum duis est elit tempor quis commodo.',
  },
  {
    id: 8,
    status: 'Fixed',
    owner: 'Brianne',
    // effort: 40,
    created: new Date('Fri Jul 10 2020 22:10:05 GMT+0700 (Indochina Time)'),
    // due: new Date('Sun Apr 25 2021 21:25:10 GMT+0700 (Indochina Time)'),
    title:
      'Dolor asperiores est sed repudiandae hic natus similique soluta quidem.',
    description:
      'Odit aut ullam sint maiores qui accusantium et voluptatem.' +
      '\nRem aspernatur atque rerum ut.' +
      '\nIllum dignissimos laudantium repellat sed non blanditiis minus non.' +
      '\nLaudantium quia eligendi repudiandae nesciunt qui in.' +
      '\nEaque veritatis qui maxime ipsam assumenda id iste aut.',
  },
  {
    id: 9,
    status: 'New',
    owner: 'Yvonne',
    effort: 16,
    created: new Date('Tue Jun 02 2020 01:42:43 GMT+0700 (Indochina Time)'),
    // due: new Date('Sun Dec 20 2020 01:36:19 GMT+0700 (Indochina Time)'),
    title: 'Eos commodi dolor.',
    description:
      'Odit aut ullam sint maiores qui accusantium et voluptatem.' +
      '\nQuo sit velit quo.' +
      '\nConsectetur porro ea consectetur fugit iste exercitationem odio.' +
      '\nA voluptas accusantium.' +
      '\nNisi ad hic facilis cum impedit.',
  },
  {
    id: 10,
    status: 'Closed',
    owner: 'Miller',
    effort: 21,
    created: new Date('Mon Aug 03 2020 19:50:06 GMT+0700 (Indochina Time)'),
    due: new Date('Mon Mar 01 2021 02:40:31 GMT+0700 (Indochina Time)'),
    title: 'Eius et harum totam dolore molestiae est tempora et.',
    // description:
    //   'Odit aut ullam sint maiores qui accusantium et voluptatem.' +
    //   '\nPraesentium reiciendis sint.' +
    //   '\nEt quae voluptatem praesentium recusandae et voluptas cumque quod nulla.' +
    //   '\nSunt veritatis omnis quaerat sit ex eveniet molestiae mollitia.' +
    //   '\nTempore et fugiat ratione maxime et sed rerum explicabo consequatur.',
  },
  {
    id: 11,
    status: 'Fixed',
    owner: 'Rickie',
    effort: 10,
    created: new Date('Sun May 17 2020 18:19:44 GMT+0700 (Indochina Time)'),
    due: new Date('Sun Jul 18 2021 17:10:25 GMT+0700 (Indochina Time)'),
    title: 'Accusantium ut eos quis harum corrupti alias minus dolore est.',
    description:
      'Mollitia est quos consequuntur molestiae et.' +
      '\nVoluptates odio sequi blanditiis deserunt occaecati.' +
      '\nNam corrupti alias earum vel.' +
      '\nExcepturi optio et quae temporibus ad dicta enim.' +
      '\nCupiditate voluptas asperiores.',
  },
  {
    id: 12,
    status: 'New',
    owner: 'Terence',
    effort: 9,
    created: new Date('Fri Apr 03 2020 16:59:07 GMT+0700 (Indochina Time)'),
    due: new Date('Thu Mar 04 2021 16:18:15 GMT+0700 (Indochina Time)'),
    title: 'Veniam et voluptatem blanditiis nihil tempore ut.',
    description:
      'Id voluptas minima aut rerum sint et odio excepturi.' +
      '\nSimilique quod est ut.' +
      '\nProvident sit laboriosam sunt suscipit qui.' +
      '\nQuis id repellat voluptas.' +
      '\nVelit corrupti id impedit voluptatem ut.',
  },
];

db.issue.insertMany(issuesDBInit);
const count = db.issue.count();
print('Inserted ', count, ' issues');

db.counter.remove({ _id: 'issue' });
db.counter.insertOne({
  _id: 'issue',
  current: count,
});

db.issue.createIndex({ id: 1 }, { unique: true });
db.issue.createIndex({ status: 1 });
db.issue.createIndex({ owner: 1 });
db.issue.createIndex({ created: 1 });
db.issue.createIndex({ title: 'text', description: 'text' });
db.deleted_issue.createIndex({ id: 1 }, { unique: true });
