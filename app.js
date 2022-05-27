const cheerio = require('cheerio')
const superagent = require('superagent')
const fs = require('fs')
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
            if (index !== 0) {
              const $td = $(this).children().eq(1)
              const link = weiboURL + $td.find('a').attr('href')
              const text = $td.find('a').text()
              const hotValue = $td.find('span').text()
              const icon = $td.find('img').attr('src')
                ? 'https:' + $td.find('img').attr('src')
                : ''
              hotList.push({
                index,
                link,
                text,
                hotValue,
                icon,
              })
            }
          })
        hotList.length ? resolve(hotList) : reject('errer')
      })
      .catch((err) => {
        reject('request error')
      })
  })
}

(async function () {
  try {
    const hotList = await getHotSearchList()
    await fs.writeFileSync(
      `${__dirname}/hotSearch.json`,
      JSON.stringify(hotList),
      'utf-8'
    )
    console.log('写入成功', Date.now())
  } catch (error) {
    console.error(error)
  }
})()

module.exports = { getHotSearchList }
