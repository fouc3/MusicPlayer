const fs = require('fs');
const path = require('path');

/* global hexo */

if (typeof hexo !== 'undefined') {
    const config = Object.assign({
        enable: true,
        metingApi: {
            api: "https://api.injahow.cn/meting/",
            server: "netease",
            type: "playlist",
            id: "2619366284",
        },
    }, hexo.config.music_player || {});

    if (config.enable) {
        // 注入 CSS 到 head
        hexo.extend.injector.register('head_end', () => {
            return `<link rel="stylesheet" href="/css/style.css">`;
        });

        // 注入 JS 到 body_end
        hexo.extend.injector.register('body_end', () => {
            return `
        <script>
            window.HEXO_MUSIC_CONFIG = ${JSON.stringify(config)};
        </script>
        <script src="/js/music-player.iife.js"></script>
        `;
        });

        const distDir = path.join(__dirname, 'dist');

        hexo.extend.generator.register('music_player_assets', function (locals) {
            if (!fs.existsSync(distDir)) {
                return [];
            }

            const files = fs.readdirSync(distDir);
            return files.map(file => {
                const ext = path.extname(file);
                let route = '';
                if (ext === '.js') route = 'js/' + file;
                if (ext === '.css') route = 'css/' + file;

                if (route) {
                    return {
                        path: route,
                        data: function () {
                            return fs.createReadStream(path.join(distDir, file));
                        }
                    };
                }
            }).filter(Boolean);
        });
    }
}
