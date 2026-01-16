# Hexo MD3 Music Player

一个美观的、基于 Material Design 3 风格的 Hexo 音乐播放器插件。支持 MetingAPI，具备深色模式自适应、吸附边缘、拖拽、桌面/移动端适配等特性。

基于 [acmuhan/MuHanBlog](https://github.com/acmuhan/MuHanBlog) 提取部分文件后修改并兼容 Hexo。

## 特性

- **Material Design 3 风格**：现代化的 UI 设计，支持动态圆角和交互动画。
- **MetingAPI 支持**：轻松集成网易云、QQ 音乐等平台的歌单、专辑或单曲。
- **深色模式适配**：自动跟随 Hexo 主题的深色/浅色模式切换（支持 `class="dark"` 和 `data-theme="dark"`）。
- **响应式布局**：
  - **桌面端**：支持拖拽、折叠、展开，支持配置左右布局。
  - **移动端**：自适应屏幕，防遮挡，支持默认最小化。
- **丰富配置**：支持圆角、尺寸、水印、自动播放、随机播放等多种配置。

## 安装

如果你使用的是本地包：

1. 将插件文件夹放入 Hexo 项目的 `node_modules` 或其他目录。
2. 在 `package.json` 中添加依赖或使用软链接。

如果你使用的是 npm 包：

1. 使用 `npm install "https://github.com/fouc3/hexo-Md3-Music-Player"` 安装插件。
2. 在 `package.json` 中添加依赖。

## 配置

在 Hexo 的 `_config.yml` 文件中添加以下配置：

```yaml
# Music Player Plugin 音乐播放器插件
music_player:
  enable: true
  
  # Meting 配置
  metingApi:
    api: "https://api.injahow.cn/meting/" # Meting API 地址
    server: "netease"  # 音乐平台: netease, tencent, kugou, xiami, baidu
    type: "playlist"   # 类型: song, playlist, album, search, artist
    id: "2619366284"   # 歌单/歌曲 ID
    
  # 播放控制
  enableAutoPlay: false         # 是否自动播放
  enableShuffle: true           # 是否随机播放
  enableRepeat: false           # 是否循环播放
  enableKeyboardShortcuts: true # 是否启用键盘快捷键
  defaultVolume: 0.7            # 默认音量 (0.0 - 1.0)
  
  # 样式与布局
  borderRadius: "16px"          # 圆角大小 (例如 "16px", "8px", "0px")
  layout: "right"               # 布局方向: "left" (左侧) 或 "right" (右侧)
  
  # 尺寸配置 (单位: px)
  miniWidth: 280                # 收起状态宽度
  expandedWidth: 360            # 展开状态宽度
  expandedHeight: 350           # 展开状态高度
  
  # 移动端设置
  startMinimizedMobile: false   # 手机端是否默认最小化到边缘 (只显示小图标)
  
  # 其他
  watermark: 'This player is based on <a href="https://github.com/fouc3/hexo-Md3-Music-Player" target="_blank">hexo-Md3-Music-Player</a>' # 自定义水印 (支持 HTML，显示在头部控制栏下方)
```

## 构建

如果你需要修改源码并重新构建插件：

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

# 待办清单

- [ ] 优化展开时的动画
- [ ] 支持外挂标签

## License

MIT
