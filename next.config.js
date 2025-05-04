/** @type {import('next').NextConfig} */

module.exports = {

    // experimental: {
    //   staleTimes: {
    //     dynamic: 60,
    //   },
    // },
    // logging: {
    //   fetches: {
    //     fullUrl: true,
    //   },
    // },

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/uploads/**',
            },
        ],
    },
};