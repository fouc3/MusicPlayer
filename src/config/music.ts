export interface MetingConfig {
    api: string;
    server: string;
    type: string;
    id: string;
}

export interface MusicConfig {
    metingConfig: MetingConfig; // 新增 Meting 配置
    defaultPlaylistId: number; // 保留兼容
    pageSize: number;
    enableKeyboardShortcuts: boolean;
    enableAutoPlay: boolean;
    enableShuffle: boolean;
    enableRepeat: boolean;
    defaultVolume: number;
    preloadPages: number; //预加载页数
    borderRadius: string; // 圆角配置，例如: "0px" (棱角), "8px" (小圆角), "16px" (大圆角)
    miniWidth: number; // 收起状态宽度 (px)
    expandedWidth: number; // 展开状态宽度 (px)
    expandedHeight: number; // 展开状态高度 (px)
    layout: "left" | "right"; // 布局方向
}

// 从全局变量读取配置（Hexo 注入）
const globalConfig = (typeof window !== "undefined" && (window as any).HEXO_MUSIC_CONFIG) || {};

export const musicConfig: MusicConfig = {
    metingConfig: {
        api: globalConfig.metingApi?.api || "https://api.injahow.cn/meting/",
        server: globalConfig.metingApi?.server || "netease",
        type: globalConfig.metingApi?.type || "playlist",
        id: globalConfig.metingApi?.id || "2619366284",
    },
    defaultPlaylistId: parseInt(globalConfig.metingApi?.id) || 2619366284,
    pageSize: globalConfig.pageSize || 60, // 默认显示60首歌曲
    enableKeyboardShortcuts: globalConfig.enableKeyboardShortcuts !== false,
    enableAutoPlay: globalConfig.enableAutoPlay || false,
    enableShuffle: globalConfig.enableShuffle !== false, // 默认开启随机播放
    enableRepeat: globalConfig.enableRepeat || false,
    defaultVolume: globalConfig.defaultVolume || 0.7,
    preloadPages: globalConfig.preloadPages || 10, // 预加载更多页面获取所有歌曲
    borderRadius: globalConfig.borderRadius || "16px", // 默认圆角16px
    miniWidth: globalConfig.miniWidth || 280, // 默认收起宽度280px
    expandedWidth: globalConfig.expandedWidth || 360, // 默认展开宽度360px
    expandedHeight: globalConfig.expandedHeight || 600, // 默认展开高度600px
    layout: globalConfig.layout || "right", // 默认右下角
};

export interface Song {
    id: number;
    name: string;
    artist: string;
    url: string;
    pic_url: string;
}

export interface PlaylistResponse {
    code: number;
    playlist_id: number;
    playlist_name: string;
    songs: Song[];
    pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
}

export interface MusicPlayerState {
    isVisible: boolean;
    isPlaying: boolean;
    isExpanded: boolean;
    isLoading: boolean;
    currentSong: Song | null;
    currentTime: number;
    duration: number;
    volume: number;
    isShuffle: boolean;
    isRepeat: boolean;
    currentPage: number;
    totalPages: number;
    playlist: Song[]; // 当前页面显示的歌曲列表
    currentIndex: number;
    fullPlaylist: Song[]; // 完整的歌曲列表（多页合并）
    shuffledPlaylist: Song[]; // 随机播放列表
    shuffleIndex: number; // 随机播放列表中的当前索引
}
