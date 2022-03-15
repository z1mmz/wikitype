export async function fetchRandomWiki(){
    try{
        let res = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
        return await res.json();
        
    }
    catch(error){
        console.log(error);
    }
};