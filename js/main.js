let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
const collegeApi = 'http://universities.hipolabs.com/search?country=' 

const colContainer = document.getElementById('colContainer')

function UpdateColleges(res){

    colContainer.innerHTML = '<div class="row"><h2 class="col-sm-12 mb-3">Universities in '+ res[0].country +' ('+res.length+')</h2></div>'
    states = {} 
    stateContainers = {}


    res.map( (college) => {

        let state = college['state-province']
        original_state = state
        state = state == null ? '' : state
        
        if( !states[state] ) {

            states[state] = res.filter( c => c['state-province'] == original_state ).length 
            stateContainers[state] = document.createElement('div')
            stateContainers[state].className = 'row w-100'

            if (state != ''){
                title = document.createElement('h3')
                title.innerText = state + ' (' + states[state] +')'
                title.className = 'col-sm-12 my-3'
                stateContainers[state].append( title )
            } else {
                stateContainers[state].innerHTML = '<hr class="hr hr-blurry col-sm-12" />'
            }
        }

        newcollege = document.createElement('a')
        newcollege.className = 'btn btn-primary text-white flex-grow-1 m-2'
        newcollege.href = college.web_pages[0]
        newcollege.target= "_blank"
        newcollege.innerText = college.name

        stateContainers[state].append(newcollege)

    })

    if (stateContainers[""]){
        stateContainers['Other'] = stateContainers[""]
        delete stateContainers[""]
    }
    for ( sc in stateContainers ){
        colContainer.append(stateContainers[sc])
    }
}

var map;
function newMap(){

    map = new jsVectorMap({
        map: 'world', // 'canada', ...
        selector: '#map', 
        regionsSelectable: true,
        regionsSelectableOne: true,
        draggable: true,
        zoomAnimate: true,
        onRegionSelected: function (code) {
            regionSelected = regionNames.of(code)
            fetch( collegeApi + regionSelected )
                .then((response) => response.json())
                .then(UpdateColleges)
                .catch( err => {
                    console.log(err)
                    colContainer.innerText=('No Data') 
                })
        }
    })
} 

newMap()

function onResize(){ 
    map.updateSize()
}

window.addEventListener('resize', onResize)
