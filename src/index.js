console.log('test');
let jas ={
    data: [
      {
        eventTimelyCompleteRate: 0,
        total: 0,
        type: "商户服务平台"
      },
      {
        eventTimelyCompleteRate: 0,
        total: 0,
        type: "新云平台"
      },
      {
        eventTimelyCompleteRate: 79.17,
        total: 24,
        type: "内部维修"
      },
      {
        eventTimelyCompleteRate: 0,
        total: 0,
        type: "数据异常"
      }
    ],
    count: 4
  }
  let pa = jas.data.filter((item)=>{
        if(item.type=='商户服务平台'||item.type=='新云平台') {
            return false
        }else{
            return true
        }
            // return item.type!='商户服务平台'&&item.type!='新云平台'
        })
console.log(pa)
// require('!style-loader!css-loader!./index.css');
require('./index.css');
require('./index.less')