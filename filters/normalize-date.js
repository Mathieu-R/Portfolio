function normalizeDate(dust) {
  dust.filters.normalizeDate = date => {
    const splittedDate = date.split('-');
    const year = splittedDate[0];
    const month = splittedDate[1];
    const day = splittedDate[2];
  }
}

module.exports = normalizeDate;
