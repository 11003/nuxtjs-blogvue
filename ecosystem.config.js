module.exports = {
    apps: [
        {
            name: 'nuxt2-blog',
            exec_mode: 'cluster',
            instances: '1', // Or a number of instances
            script: './node_modules/nuxt/bin/nuxt.js',
            args: 'start'
        }
    ]
}
