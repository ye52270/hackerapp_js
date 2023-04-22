const container = document.getElementById("root");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const store = {
    currentPage: 1,
    totalPage: 0,
    pagingCount: 8,
    feeds: []
};
const getData = (method, url, option = false)=>{
    console.log(url);
    const ajax = new XMLHttpRequest();
    ajax.open(method, url, option);
    ajax.send();
    return JSON.parse(ajax.response);
};
function makeFeed(feeds) {
    for(let i = 0; i < feeds.length; i++)feeds[i].read = false;
    return feeds;
}
// -----------------------------------------  News Feed
function newsFeed() {
    let newsFeed = store.feeds;
    const newsList = [];
    const totalPage = newsFeed.length / store.pagingCount;
    if (!newsFeed.length) newsFeed = store.feeds = makeFeed(getData("GET", NEWS_URL));
    let template = `
  <div class="bg-gray-600 min-h-screen">
  <div class="bg-white text-xl">
    <div class="mx-auto px-4">
      <div class="flex justify-between items-center py-6">
        <div class="flex justify-start">
          <h1 class="font-extrabold">Hacker News</h1>
        </div>
        <div class="items-center justify-end">
          <a href="#/page/{{__prev_page__}}" class="text-gray-500">
            Previous
          </a>
          <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
            Next
          </a>
        </div>
      </div> 
    </div>
  </div>
  <div class="p-4 text-2xl text-gray-700">
    {{__news_feed__}}        
  </div>
</div>
  `;
    for(let i = (store.currentPage - 1) * store.pagingCount; i < store.currentPage * store.pagingCount && i < newsFeed.length; i++)newsList.push(`
      <div  class="p-6 ${newsFeed[i].read ? "bg-gray-300" : "bg-white"} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
      <div class="flex">
        <div class="flex-auto">
          <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
        </div>
        <div class="text-center text-sm">
          <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="grid grid-cols-3 text-sm text-gray-500">
          <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
          <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
          <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
        </div>  
      </div>
    </div>    
    `);
    template = template.replace("{{__news_feed__}}", newsList.join(""));
    template = template.replace("{{__prev_page__}}", store.currentPage > 1 ? store.currentPage - 1 : 1);
    template = template.replace("{{__next_page__}}", store.currentPage < totalPage ? store.currentPage + 1 : store.currentPage);
    container.innerHTML = template;
}
// -----------------------------------------  News Detail
function newsDetail() {
    const id = location.hash.replace("#/show/", "");
    const newsContent = getData("GET", CONTENT_URL.replace("@id", id));
    store.feeds.find((feed)=>{
        if (feed.id === Number(id)) {
            feed.read = true;
            console.log(`feed.id = ${typeof feed.id} , id = ${typeof id}`);
        }
    });
    // store.feeds.forEach((feed, index) => {
    //   console.log(index, feed.read);
    // });
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/${store.currentPage}" class="text-gray-500">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full border rounded-xl bg-white m-6 p-4 ">
      <h2>${newsContent.title}</h2>
      <div class="text-gray-400 h-20">
        ${newsContent.content}
      </div>

      {{__comments__}}

    </div>
  </div>
`;
    function makeComment(comments, called = 0) {
        const commentString = [];
        for(let i = 0; i < comments.length; i++){
            commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comments[i].user}</strong> ${comments[i].time_ago} / ${called}
        </div>
        <p class="text-gray-700">${comments[i].content}</p>
      </div>      
    `);
            if (comments[i].comments.length > 0) commentString.push(makeComment(comments[i].comments, called + 1));
        }
        return commentString.join("");
    }
    container.innerHTML = template.replace("{{__comments__}}", makeComment(newsContent.comments));
}
function router() {
    const routePath = location.hash;
    const regExp = /[0-9]/gi;
    if (routePath === "") newsFeed();
    else if (routePath.indexOf("#/page/") >= 0) {
        store.currentPage = Number(routePath.match(regExp)[0]);
        newsFeed();
    } else newsDetail();
}
window.addEventListener("hashchange", router);
router();

//# sourceMappingURL=index.7c0ccee6.js.map
