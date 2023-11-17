
const render= (obj,holder,create)=>{
    // console.log(holder);
    holder.appendChild(create(obj));
};
const renderError=(holder)=>{
    holder.innerHTML=`<div>
    <h2 class="display-1 text-white text-center">The Country Is Not Exist</h2>
    </div>`;
}
const fetchAxios= async(apiUrl,options)=>{

    const res = await axios(
        {
            method: 'GET',
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Client-ID ",
            },
            params: options
        }
    );
    return res.data;
};

export {fetchAxios, render, renderError}