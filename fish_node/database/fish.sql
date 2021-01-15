/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : fish

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2021-01-15 15:05:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for f_ad
-- ----------------------------
DROP TABLE IF EXISTS `f_ad`;
CREATE TABLE `f_ad` (
  `id` int(11) NOT NULL,
  `type` int(255) NOT NULL,
  `content` text NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ct` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `sign` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of f_ad
-- ----------------------------

-- ----------------------------
-- Table structure for f_article
-- ----------------------------
DROP TABLE IF EXISTS `f_article`;
CREATE TABLE `f_article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `ct` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  `sign` varchar(255) NOT NULL DEFAULT '',
  `category_id` int(11) NOT NULL,
  `goods_count` varchar(255) DEFAULT NULL,
  `comments_count` varchar(255) DEFAULT NULL,
  `collections_count` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of f_article
-- ----------------------------
INSERT INTO `f_article` VALUES ('1', '测试', '钓吧老哥，除了鱼啥都能钓', null, '0', '', '0', null, null, null);

-- ----------------------------
-- Table structure for f_article_info
-- ----------------------------
DROP TABLE IF EXISTS `f_article_info`;
CREATE TABLE `f_article_info` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `comment_info` varchar(255) DEFAULT NULL,
  `from` int(11) NOT NULL,
  `to` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of f_article_info
-- ----------------------------

-- ----------------------------
-- Table structure for f_category
-- ----------------------------
DROP TABLE IF EXISTS `f_category`;
CREATE TABLE `f_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `categroy_intro` varchar(255) DEFAULT NULL,
  `ct` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  `status` int(11) DEFAULT '1',
  `type` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of f_category
-- ----------------------------

-- ----------------------------
-- Table structure for f_message
-- ----------------------------
DROP TABLE IF EXISTS `f_message`;
CREATE TABLE `f_message` (
  `id` int(11) NOT NULL,
  `from` int(11) NOT NULL,
  `to` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `ct` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of f_message
-- ----------------------------

-- ----------------------------
-- Table structure for f_rotation_img
-- ----------------------------
DROP TABLE IF EXISTS `f_rotation_img`;
CREATE TABLE `f_rotation_img` (
  `id` int(11) NOT NULL,
  `img_url` varchar(255) NOT NULL,
  `info` varchar(255) DEFAULT NULL,
  `content` text,
  `sign` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of f_rotation_img
-- ----------------------------

-- ----------------------------
-- Table structure for f_user
-- ----------------------------
DROP TABLE IF EXISTS `f_user`;
CREATE TABLE `f_user` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `pass_word` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `permission` int(11) NOT NULL DEFAULT '1',
  `introduce` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `ct` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of f_user
-- ----------------------------
