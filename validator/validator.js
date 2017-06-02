const fs = require('fs');

try {
  const path = process.argv[2];
  const lighthouse = fs.readFileSync(path);
  const aggregations = JSON.parse(lighthouse).aggregations;
  const total = aggregations.map(aggregation => {
    const subtotal = aggregation.score.reduce((acc, score) => {
      return acc += score.overall;
    }, 0);

    return subtotal / aggregation.score.length;
  });

  const avg = total.reduce((acc, score) => acc += score, 0) / total.length

  console.log(`Lighthouse Score: ${Math.round(avg * 100 * 10) / 10}%`);

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
