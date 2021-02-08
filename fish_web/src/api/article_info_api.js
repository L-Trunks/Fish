import { get, post } from './http'

const url = '/api/article_info'
/**
 * 添加文章信息(添加点赞、评论、收藏信息)
 */
export const addArticleInfo = (params) => {
    return post(url + '/add_article_info', params)
}

/**
 * 删除信息
 */
export const DeleteArticleInfo = (params) => {
    return get(url + '/delete_article_info', params)
}

/**
 * 获取点赞状态
 */
export const UpdateArticleInfo = (params) => {
    return post(url + '/update_article_info', params)
}

/**
 * 根据类型查询文章信息
 */
export const SelectArticleInfoByType = (params) => {
    return get(url + '/select_article_info_by_type', params)
}

/**
 * 根据id查询文章信息
 */
export const SelectArticleInfoById = (params) => {
    return get(url + '/select_article_info_by_id', params)
}

/**
 * 根据用户查询文章信息
 */
export const SelectArticleInfoByUser = (params) => {
    return get(url + '/select_article_info_by_user', params)
}

/**
 * 根据文章和类型查询文章信息
 */
export const SelectArticleInfoByArticleAndType = (params) => {
    return get(url + '/select_article_info_by_article_and_type', params)
}

/**
 * 根据文章查询文章信息
 */
export const SelectArticleInfoByArticle = (params) => {
    return get(url + '/select_article_info_by_article', params)
}

