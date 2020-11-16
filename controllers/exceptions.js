const pageNotFound = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Errrrou'})
}

exports.pageNotFound = pageNotFound;