const fs = require('fs');

try {
  const path = process.argv[2];
  const lighthouse = fs.readdirSync(path);
  const aggregations = JSON.parse(lighthouse).aggregations;
  const avg = aggregations.reduce(aggregation => {
    return aggregation.score.reduce((acc, score) => {
      return acc += score.overall;
    }, 0) / aggregation.score.length;
  }, 0) / aggregations.length;

  console.log(`Lighthouse Score: ${avg}`);

  if (avg < 0.7) {
    console.log(`PWA score is not high enough. Consider to fix performance bottleneck.`);
    process.exit(1);
  }

  // OK
  process.exit(0);
} catch(error) {
  console.log(error);
  process.exit(1);
}

