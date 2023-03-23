var lanes = [];

var result = false;

function Contains(list, x) {
    for (let i = 0; i < list.length; i++) {
        if (list[i]["name"] === x["name"]) {
            return true;
        }
    }
    return false;
}

function LoadChampions(more=false) {

    fetch('./champions_id.json')
        .then((response) => response.json())
        .then(ids => {
            fetch('./champions.json')
            .then((response) => response.json())
            .then(champions => {
                let container = document.querySelector('.champion-container');
                if (more) {
                    var html = container.innerHTML;
                } else {
                    var html = "";
                }

                if (lanes.length <= 0) {
                    for (let i = 0; i<champions.length; i++) {
                        html_segment = `
                        <div class="champion">
                            <img src="http://ddragon.leagueoflegends.com/cdn/13.5.1/img/champion/${ids[champions[i]["id"]]}.png">
                            <p>${champions[i]["name"]}</p>
                        </div>
                        `;
                        html+=html_segment;
                    }
                    document.querySelector('.champion-container').innerHTML = html;
                } else {
                    let champions_array = [];
                    for (let i_champion = 0 ; i_champion < champions.length ; i_champion++) {

                        for (let i_champion_tag = 0; i_champion_tag < champions[i_champion]["lane"].length; i_champion_tag++) {
                            
                            for (let i_tag = 0; i_tag < lanes.length;i_tag++) {
    
                                if (champions[i_champion]["lane"][i_champion_tag] == lanes[i_tag] && 
                                Contains(champions_array,champions[i_champion]) == false) {
                                    html_segment = `
                                    <div class="champion">
                                        <img src="http://ddragon.leagueoflegends.com/cdn/13.5.1/img/champion/${ids[champions[i_champion]["id"]]}.png">
                                        <p>${champions[i_champion]["name"]}</p>
                                    </div>
                                    `;
                                    html+=html_segment;
                                    champions_array.push(champions[i_champion]);
                                }
                            }
                        }
                    }
                    document.querySelector('.champion-container').innerHTML = html;
                }
            })
        })
}

var pos = 0;

function LaunchWheel() {
    LoadChampions();

    let height = document.querySelector('.champion-container').offsetHeight;
    pos += -10000-Math.random()*10000;
    let pos2 = pos;
    while (pos2 < 0) {
        LoadChampions(true);
        pos2 += height;
    }
    document.querySelector('.champion-container').style.transform = "translateY("+pos+"px)";
    document.querySelector('.start-button').classList.add("hide");
    document.querySelector('.restart-button').classList.remove("hide");
    result = true;
}



function CheckAnswer(element) {
    if (result == false) {
        if (element.classList.contains("is-checked")) {
            const index = lanes.indexOf(element.innerText.toLowerCase());
            if (index > -1) {
                lanes.splice(index, 1);
            }
        }
        else {
            lanes.push(element.innerText.toLowerCase());
        }
        element.classList.toggle("is-checked");
        LoadChampions(false);
    }
}


LoadChampions();