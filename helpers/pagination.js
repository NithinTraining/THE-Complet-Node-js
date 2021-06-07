exports.Paginate = (data) => {
    return {
      currentPage: +data.currentPage,
      limit: +data.limit
    }
}

  exports.LimitOffset = (data) => {
    return {
      limit: data.limit,
      offset: ((data.currentPage - 1) * data.limit)
    }
  }

  