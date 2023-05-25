const Article = require('../models/Article')


async function getPosts(req, res) {
    try {
        res.send()
    }
    catch(err) {
        console.log(err)
    }
}

const posts = [
    {
        title: 'Fitzgerald and the Writers’ Strike',
        content: 'F. Scott’s last creation is a warning to the picket line',
        authorName: 'Paul Greenberg',
        date: 'Apr 28',
        tag: 'Writing',
        id: '120'
    },

]