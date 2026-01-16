import type { PlaylistResponse, Song } from "../config/music";
import { musicConfig } from "../config/music";

export class MusicAPI {
	private metingApi: string;
	private metingServer: string;
	private metingType: string;
	private metingId: string;
	private defaultPlaylistId: number;
	private pageSize: number;

	constructor() {
		this.metingApi = musicConfig.metingConfig.api;
		this.metingServer = musicConfig.metingConfig.server;
		this.metingType = musicConfig.metingConfig.type;
		this.metingId = musicConfig.metingConfig.id;
		this.defaultPlaylistId = musicConfig.defaultPlaylistId;
		this.pageSize = musicConfig.pageSize;
	}

	/**
	 * 随机获取3页歌曲数据
	 * 注：Meting API 一次返回所有歌曲，这里模拟分页逻辑
	 */
	async getAllSongs(
		playlistId = this.defaultPlaylistId,
		cookiesJson?: string,
		musicU?: string,
	): Promise<{ songs: Song[]; totalPages: number }> {
		if (import.meta.env.DEV) {
			console.log("开始获取所有歌曲数据...");
		}

		try {
			// Meting 一次性返回所有歌曲
			const allSongs = await this.fetchFromMeting();

			if (allSongs.length === 0) {
				return this.getMockAllSongsData();
			}

			// 模拟分页：随机选择60首歌曲
			const shuffled = this.shuffleArray(allSongs);
			const selectedSongs = shuffled.slice(0, Math.min(60, allSongs.length));

			if (import.meta.env.DEV) {
				console.log(`获取完成，总歌曲数量: ${allSongs.length}，选择: ${selectedSongs.length}首`);
			}

			return {
				songs: selectedSongs,
				totalPages: Math.ceil(allSongs.length / this.pageSize),
			};
		} catch (error) {
			console.error("获取歌曲失败:", error);
			return this.getMockAllSongsData();
		}
	}

	/**
	 * 批量获取多页歌单数据
	 */
	async getMultiplePages(
		playlistId = this.defaultPlaylistId,
		pages = 5,
		pageSize = this.pageSize,
		cookiesJson?: string,
		musicU?: string,
	): Promise<{ songs: Song[]; totalPages: number }> {
		console.log(`开始获取${pages}页歌曲数据...`);

		try {
			const allSongs = await this.fetchFromMeting();

			if (allSongs.length === 0) {
				return this.getMockAllSongsData();
			}

			// 模拟获取多页
			const totalPages = Math.ceil(allSongs.length / pageSize);
			const requestedSongs = allSongs.slice(0, pages * pageSize);

			console.log(`多页获取完成，总歌曲数量: ${requestedSongs.length}`);

			return {
				songs: requestedSongs,
				totalPages,
			};
		} catch (error) {
			console.error("获取歌曲失败:", error);
			return this.getMockAllSongsData();
		}
	}

	/**
	 * 获取歌单数据 - 对接 Meting API
	 */
	async getPlaylist(
		playlistId = this.defaultPlaylistId,
		page = 1,
		pageSize = this.pageSize,
		cookiesJson?: string,
		musicU?: string,
		retries = 3,
	): Promise<PlaylistResponse> {
		try {
			const allSongs = await this.fetchFromMeting();

			if (allSongs.length === 0) {
				console.warn("Meting API 返回空数据，使用模拟数据");
				return this.getMockPlaylistData(page, pageSize);
			}

			// 分页处理
			const total = allSongs.length;
			const totalPages = Math.ceil(total / pageSize);
			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const songs = allSongs.slice(startIndex, endIndex);

			return {
				code: 200,
				playlist_id: playlistId,
				playlist_name: "网易云歌单",
				songs,
				pagination: {
					page,
					page_size: pageSize,
					total,
					total_pages: totalPages,
					has_next: page < totalPages,
					has_prev: page > 1,
				},
			};
		} catch (error) {
			console.error("获取歌单失败:", error);
			return this.getMockPlaylistData(page, pageSize);
		}
	}

	/**
	 * 从 Meting API 获取歌曲列表
	 */
	private async fetchFromMeting(): Promise<Song[]> {
		const params = new URLSearchParams({
			server: this.metingServer,
			type: this.metingType,
			id: this.metingId,
		});

		const url = `${this.metingApi}?${params}`;

		if (import.meta.env.DEV) {
			console.log("调用 Meting API:", url);
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000);

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
				signal: controller.signal,
				mode: "cors",
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			// Meting API 返回格式: [{ name, artist, url, pic, lrc, ... }]
			if (Array.isArray(data)) {
				return data.map((item: any, index: number) => ({
					id: item.id || index + 1,
					name: item.name || item.title || "未知歌曲",
					artist: item.artist || item.author || "未知艺术家",
					url: item.url || "",
					pic_url: item.pic || item.cover || "",
				}));
			}

			throw new Error("Meting API 返回格式不正确");
		} catch (error) {
			clearTimeout(timeoutId);
			throw error;
		}
	}

	/**
	 * 随机打乱数组
	 */
	private shuffleArray<T>(array: T[]): T[] {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	/**
	 * 获取模拟所有歌曲数据（用于API失败时的降级）
	 */
	private getMockAllSongsData(): { songs: Song[]; totalPages: number } {
		const mockSongs: Song[] = [];

		// 生成更多模拟歌曲数据
		for (let i = 1; i <= 100; i++) {
			mockSongs.push({
				id: i,
				name: `示例歌曲 ${i}`,
				artist: `示例艺术家 ${Math.ceil(i / 10)}`,
				url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
				pic_url: `https://via.placeholder.com/300x300/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff?text=Music${i}`,
			});
		}

		return {
			songs: mockSongs,
			totalPages: 5,
		};
	}

	/**
	 * 获取模拟歌单数据（用于API失败时的降级）
	 */
	private getMockPlaylistData(
		page: number,
		pageSize: number,
	): PlaylistResponse {
		const mockSongs: Song[] = [
			{
				id: 1,
				name: "示例歌曲 1",
				artist: "示例艺术家",
				url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
				pic_url: "https://via.placeholder.com/300x300/4f46e5/ffffff?text=Music",
			},
			{
				id: 2,
				name: "示例歌曲 2",
				artist: "示例艺术家 2",
				url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
				pic_url: "https://via.placeholder.com/300x300/7c3aed/ffffff?text=Music",
			},
		];

		return {
			code: 200,
			playlist_id: this.defaultPlaylistId,
			playlist_name: "示例歌单",
			songs: mockSongs,
			pagination: {
				page,
				page_size: pageSize,
				total: mockSongs.length,
				total_pages: 1,
				has_next: false,
				has_prev: false,
			},
		};
	}

	/**
	 * 验证歌曲URL是否可访问
	 */
	async validateSongUrl(url: string): Promise<boolean> {
		try {
			const response = await fetch(url, { method: "HEAD" });
			return response.ok;
		} catch {
			return false;
		}
	}

	/**
	 * 获取歌曲的元数据
	 */
	async getSongMetadata(url: string) {
		try {
			const response = await fetch(url, { method: "HEAD" });
			if (!response.ok) return null;

			const contentLength = response.headers.get("content-length");
			const size = contentLength ? Number.parseInt(contentLength, 10) : 0;

			// 创建临时音频元素来获取时长
			return new Promise((resolve) => {
				const audio = new Audio();
				audio.addEventListener("loadedmetadata", () => {
					resolve({
						duration: audio.duration,
						size,
					});
				});
				audio.addEventListener("error", () => {
					resolve(null);
				});
				audio.src = url;
			});
		} catch {
			return null;
		}
	}

	/**
	 * 搜索歌曲
	 */
	async searchSongs(
		query: string,
		page = 1,
		pageSize = this.pageSize,
	): Promise<Song[]> {
		console.log("搜索功能暂未实现:", { query, page, pageSize });
		return [];
	}

	/**
	 * 获取推荐歌曲
	 */
	async getRecommendedSongs(count = 10): Promise<Song[]> {
		console.log("推荐功能暂未实现:", { count });
		return [];
	}
}

// 创建单例实例
export const musicAPI = new MusicAPI();
