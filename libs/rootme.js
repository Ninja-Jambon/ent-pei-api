const get_id_from_url = async (url) => {
    const res = await fetch(url, {
        "credentials": "include",
        "headers": {
            "User-Agent": "ForOurLeaderboard",
        },
        "method": "GET",
        "mode": "cors"
    });

    const res_as_text = await res.text();
    const id = res_as_text.split(`<span class="color1">0</span><span class="gris">&nbsp;/&nbsp;5</span><div class='notation_note' ><div class='star-rating ratingstar_group_notation-auteur`)[1].split(`-`)[0];

    return id;
}

const get_points_from_id = async (user_id) => {
    const res = await fetch("https://api.www.root-me.org/auteurs/" + user_id, {
        "credentials": "include",
        "headers": {
            "User-Agent": "ForOurLeaderboard",
            "Cookie": `api_key=${process.env.Rootme}`
        },
        "method": "GET",
        "mode": "cors"
    });

    const res_as_json = await res.json();
    const points = res_as_json["score"];

    return points;
}

module.exports = {
    get_id_from_url,
    get_points_from_id,
}