module.exports = {
    apps: [{
        name: 'blog-nuxt',
        script: 'nuxt',
        args: "start",
        append_env_to_name: false,
        cwd: './',
        exec_interpreter: "bash",
        exec_mode: "cluster",
        out_file: "./logs/out-0.log",
        error_file: "./logs/err-0.log",
        merge_logs: true,
        log_data_format: 'YYYY-MM-DD HH:mm Z',
        autorestart: true,
        watch: [
            './nuxt',
            'nuxt.config.js',
            'package.json'
        ],
        max_memory_restart: '1G',
        node_args: '--harmony',
        env: {
            PORT: 3000,
            NODE_ENV: "production"
        }
    }],
};
