// Sort 
export function sortFunction(models, sortType) {

    // console.log("sorting happened")

    const storiesCopy = [...models];
    
    //bubble sorting O(n^2) time complexity 
    for(let i = 0; i< storiesCopy.length - 1; i++) {
        for(let j = 0; j < storiesCopy.length - i - 1; j++) {
            let swap_flag = false;

            //depending on the type that user select
            switch (sortType) {
              case 'ascending':
                if (compareStrings(storiesCopy[j].title, storiesCopy[j + 1].title) > 0) {
                    swap_flag = true;
                }
                break;
      
              case 'descending':
                if (compareStrings(storiesCopy[j].title, storiesCopy[j + 1].title) < 0) {
                    swap_flag = true;
                }
                break;
      
              case 'year':
                if (storiesCopy[j].published_year < storiesCopy[j + 1].published_year) {
                    swap_flag = true;
                }
                break;
      
              case 'react':
                if (storiesCopy[j].react < storiesCopy[j + 1].react) {
                    swap_flag = true;
                }
                break;
            }
            if (swap_flag) {
              const hold = storiesCopy[j];
              storiesCopy[j] = storiesCopy[j + 1];
              storiesCopy[j + 1] = hold;
            }
        }
    }

    // console.log('after sort ', storiesCopy);
    return storiesCopy;
}

// returns 0, 1, or -1
function compareStrings(string1, string2) {

    string1 = string1.toLowerCase();
    string2 = string2.toLowerCase();

    const minLen = Math.min(string1.length, string2.length);

    //compare each character 
    for(let i = 0; i < minLen; i++){
        if(string1.charCodeAt(i) < string2.charCodeAt(i)){
          return -1;
        } else if(string1.charCodeAt(i) > string2.charCodeAt(i)) {
          return 1;
        } 
        
        continue;
    }

    //else, just compare the length of each string 
    if(string1.length < string2.length){
      return -1;
    } else if (string1.length > string2.length) {
      return 1;
    }

    return 0;
}