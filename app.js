const cheerio = require('cheerio')
const superagent = require('superagent')
const fs = require('fs')
const nodeSchedule = require('node-schedule')
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
        console.log(res, 'res')
        const $ = cheerio.load(res.text)
        let hotList = []
        // console.log($("#pl_top_realtimehot table tbody").length);
        $('#pl_top_realtimehot table tbody')
          .children('tr')
          .each(function (index) {
            // console.log(index, 'index');
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
        // console.log(hotList);
        hotList.length ? resolve(hotList) : reject('errer')
      }).catch((err)=>{
        reject('request error')
      })
    // superagent.get(hotSearchURL, (err, res) => {
    //   if (err) reject('request error')
    //   // console.log(res.text);
    // })
  })
}

/*
 * schedule

*    *    *    *    *    *    
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

 */
/**
 * 每分钟第30秒定时执行爬取任务
 */
nodeSchedule.scheduleJob('30 * * * * *', async function () {
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
})
