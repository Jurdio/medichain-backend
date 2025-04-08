const basicAuth = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"')
        return res.status(401).send('Access denied')
    }

    const base64Credentials = authHeader.split(' ')[1]
    const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split(':')

    const validUser = process.env.BASIC_USER || 'admin'
    const validPass = process.env.BASIC_PASS || 'supersecret'

    if (username === validUser && password === validPass) {
        return next()
    }

    return res.status(403).send('Forbidden')
}

module.exports = basicAuth
