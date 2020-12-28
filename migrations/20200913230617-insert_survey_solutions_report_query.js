const Uuid = require('cassandra-driver').types.Uuid;

module.exports = {
  async up(db) {
    global.migrationMsg = "Insert survey solutions report query";


    if (!cassandra) {
      throw new Error("Cassandra connection not available.");
    }

    const query = 'SELECT id FROM ' + process.env.CASSANDRA_KEYSPACE + '.' + process.env.CASSANDRA_TABLE + ' WHERE qid = ? ALLOW FILTERING';
    const result = await cassandra.execute(query, ['survey_solutions_report_query'], { prepare: true });
    const row = result.rows;

    if (!row.length) {

      let id = Uuid.random();

      let query = 'INSERT INTO ' + process.env.CASSANDRA_KEYSPACE + '.' + process.env.CASSANDRA_TABLE + ' (id, qid, query) VALUES (?, ?, ?)';

      let queries =
        [{
          query: query,
          params: [id.toString(), 'survey_solutions_report_query', '{"queryType":"groupBy","dataSource":"sl_survey","granularity":"all","dimensions":["surveySubmissionId","solutionId","solutionName","questionName","questionAnswer","remarks","surveyId","questionResponseType","questionResponseLabel","questionId","questionExternalId","instanceId","instanceParentQuestion","instanceParentResponsetype","instanceParentId","instanceParentExternalId","instanceParentEcmSequence","completedDate"],"filter":{"type":"and","fields":[{"type":"selector","dimension":"solutionId","value":""},{"type":"selector","dimension":"questionResponseType","value":""},{"type":"not","field": {"type":"selector","dimension":"questionAnswer","value":""}}]},"aggregations":[],"postAggregations":[],"intervals":["1901-01-01T00:00:00+00:00/2101-01-01T00:00:0+00:00"]}']
        }];

      await cassandra.batch(queries, { prepare: true });

    }

    return global.migrationMsg;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};