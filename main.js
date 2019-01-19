console.log("Hello world!");
log=function (s){console.log(s);};
errorCallback=log;
DEBUG=true;
debug=function(e){if(DEBUG){log(e);}};
toArray=function (n){return Array.prototype.slice.call(n,0);};

newFollowList=[];

followInterval = 1000 * 60 * 2;

//urlDocument(document,followPage);
followPage(document);

function urlDocument(url,func)
{
	var x = new XMLHttpRequest();
	x.open('GET', url);
	
	x.responseType = 'document';
	x.onload = function() {

	var res_document=x.response;
	
	func(res_document);
	
	};
	x.onerror = function() {
	errorCallback('Network error.');
	};
	x.send();
}


function followPage(doc)
{
    log(doc.getElementsByClassName("UserLink-link")[0]);
    
    clzBtn = "Button FollowButton Button--primary Button--blue";
    pp = doc.getElementsByClassName(clzBtn);
    app = toArray(pp);
    
    
    var i = 0;
    setInterval(
    function()
    {
        if(i < app.length)
        {
            btn = app[i];
            
			log(btn);
            if (btn.textContent.indexOf("已关注")  == -1)
			{
				btn.click();
			}
            else
             log(btn);
        }
        i++;
    },
    followInterval
    );
    
    setTimeout(
    function()
    {
        nextPage(doc);
    },
    followInterval * (app.length + 1)
    )
    
    
}

function nextPage(doc)
{
    clzBtn = "Button PaginationButton PaginationButton-next Button--plain";
    bt = doc.getElementsByClassName(clzBtn)[0];
    if(bt)
    {
        bt.click();
        
        setTimeout(
        function()
        {
            followPage(doc);
        },1000*2
        );
    }
}


function questionPageHandler(qdocument)
{
	debug(qdocument.title);
	var answerList=getAnswerList(qdocument);
	debug(answerList);

 	toArray(answerList).forEach(function(e){
		openAnswerVoters(e);
	}); 
 	setTimeout(function(){
		//toArray(getVotersList(qdocument)).forEach(voterHandler); 
		vlist=toArray(getVotersList(qdocument));
		debug(vlist);
		if(vlist.length>5)
		{
			vlist.forEach(function(e){voterHandler(e,true);});
		}
		else
		{
			vlist.forEach(voterHandler);
		}
		
	},1000*2); 

	setTimeout(function(){closeAnswerVoters(qdocument);} ,1000*10);
}

function getAnswerList(qdocument)
{
	return qdocument.getElementsByClassName("zm-item-answer  zm-item-expanded");
}

function openAnswerVoters(answerElement)
{
	handleSubElementByClassName(answerElement,"more text",function(e){
		e.click()
	});
}

function closeAnswerVoters(qdocument)
{
	log("now close..");
	
	handleSubElementByClassName(qdocument,"modal-dialog zm-voters-dialog",
	function(e){
		e.getElementsByClassName("modal-dialog-title-close")[0].click();
	});
}

function getVotersList(qdocument)
{
	return qdocument.getElementsByClassName("zm-profile-card clearfix no-hovercard");
}

function voterHandler(voterElement)
{
	isRandom=arguments[1]?arguments[1]:false;
 	if(randTrue(100)&&isRandom)
	{
		return;
	} 
	
	var followElement=voterElement.getElementsByTagName("button")[0];
	var voterURL=voterElement.getElementsByClassName("zm-item-link-avatar")[0];
	
	
	var s=followElement.innerText
	
	if(s.indexOf("鍙栨秷")!=-1)
	{
		return;
	}
	else
	{
		log(followElement);
		log(voterURL);
		return;
	}
	

}

function handleSubElementByClassName(e,name,func)
{
	toArray(e.getElementsByClassName(name)).forEach(func);
}

function randTrue(mod)
{
	a=Math.floor(Math.random()*10);
	return a%mod!=0;
}