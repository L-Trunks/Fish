import { get, post } from './http'

const url = '/api/article'
/**
 * 获取所有文章
 */
export const SelectAllArticle = (params) => {
    return get(url+'/select_all_article',params)
}

/**
 * 根据用户获取文章
 */
export const SelectAllArticleByUser = (params) => {
    return get(url+'/select_all_article_by_user',params)
}

/**
 * 根据类型获取文章
 */
export const SelectArticleByType = (params) => {
    return get(url+'/select_article_by_type',params)
}
/**
 * 根据分类获取文章
 */
export const SelectAllArticleByType = (params) => {
    return get(url+'/select_all_article_by_type',params)
}

/**
 * 根据分类获取视频
 */
export const SelectAllVideoByType = (params) => {
    return get(url+'/select_all_video_by_type',params)
}

/**
 * 搜索
 */
export const SelectArticleByLike = (params) => {
    return get(url+'/select_article_by_like',params)
}

/**
 * 根据id获取文章信息
 */
export const SelectArticleById = (params) => {
    return get(url+'/select_article_by_id',params)
}

/**
 * 修改文章信息
 */
export const UpdateArticle = (params) => {
    return post(url+'/update_article',params)
}

/**
 * 删除文章
 */
export const DeleteArticle = (params) => {
    return get(url+'/delete_article',params)
}

/**
 * 添加文章
 */
export const AddArticle = (params) => {
    return post(url+'/add_article',params)
}

/**
 * 文章浏览量加1
 */
export const UpdateArticleLooksCount = (params) => {
    return get(url+'/update_article_looks_count',params)
}

/**
 * 修改点赞评论收藏数
 */
export const UpdateArticleCount = (params) => {
    return post(url+'/update_article_count',params)
}