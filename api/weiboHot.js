const express = require('express')
const router = express.Router()
const cheerio = require('cheerio')
const superagent = require('superagent')
const weiboURL = 'https://s.weibo.com'
const hotSearchURL = weiboURL + '/top/summary?cate=realtimehot'

/**
 * 获取热搜列表数据方法
 */
function getHotSearchList() {
  return new Promise((resolve, reject) => {
    superagent
      .get(hotSearchURL)
      .set({
        cookie:
          'SUB=_2AkMV0R1pdcPxrAVTn_EQyWvgZY5H-jymBHSfAn7uJhIyOhhu7nECqSVutBF-XDXcz_XKfP8ConVYk8o_32dN56GH; SUBP=0033WrSXqPxfM72wWs9jqgMF555t',
      })
      .then((res) => {
        const $ = cheerio.load(res.text)
        let hotList = []
        $('#pl_top_realtimehot table tbody')
          .children('tr')
          .each(function (index) {
            const t0 = $(this).children('td').eq(0).text()
            if (index !== 0 && !Number.isNaN(parseInt(t0))) {
              console.log(parseInt(t0));
              const $td = $(this).children().eq(1)
              const url = weiboURL + $td.find('a').attr('href')
              const hot_word = $td.find('a').text()
              const hot_word_num = $td.find('span').text()
              const icon = $td.find('img').attr('src')
                ? 'https:' + $td.find('img').attr('src')
                : ''
              hotList.push({
                id: index,
                url,
                hot_word,
                hot_word_num,
                icon,
              })
            }
          })
        hotList.length ? resolve(hotList) : reject('errer')
      })
      .catch(() => {
        reject('request error')
      })
  })
}

router.get('/', async (req, res) => {
  try {
    res.json({
      status: 200,
      data: await getHotSearchList(),
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send('Server error')
  }
})

module.exports = router
