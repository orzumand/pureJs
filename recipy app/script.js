const mealsEl =document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals')
const searchBtn = document.getElementById('search')
const searchTerm = document.getElementById('search-term')
const mealPopup = document.getElementById('meal-popup')
const popupCloseBtn = document.getElementById('close-popup')
const mealInfoEl = document.getElementById('meal-info')
getRandomMeal();


async function getRandomMeal(){
const randomMeal= await fetch('https://www.themealdb.com/api/json/v1/1/random.php').then((res)=>res.json().then((data)=>data.meals[0]))
  addMeal(randomMeal, true)
  console.log(await randomMeal);

}
async function getMealById(id){
const meal= await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+ id ).then((res)=> res.json().then((data)=>{
  return data.meals[0];
}))

return meal
}
async function getMealBySearch(term){
  const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term).then((res) => res.json().then((data) => data.meals))
  console.log(meals);
  return meals
}


 addMeal=(mealData,random=false)=>{
    const meal = document.createElement('div')
    meal.classList.add('meal')

    meal.innerHTML=`

          <div class="meal-header">
          ${random?
            
           ` <spam class="random">
              Random Recipe
            </spam>`
            
            :''
        }
            <img
             src="${mealData.strMealThumb}" 
             alt="${mealData.strMeal}">
          </div>
          <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
              <i class="fas fa-heart"></i>
            </button>
          
        </div>`

        const btn = meal.querySelector('.meal-body   .fav-btn')
        btn.addEventListener('click',()=>{

   if(btn.classList.contains('active')){
     removeMealFromLs(mealData.idMeal)
     btn.classList.remove('active');
   }
  
   else {
     
     addMealToLs(mealData.idMeal)
     btn.classList.add('active');
    }
    fetchFavMeals()
        
        })
   
   
    mealsEl.appendChild(meal)
  }



//Bu funksiya parametrida kelayotgan id ni localStorage ga set qilayapti
addMealToLs=(mealId)=>{
const mealIds = getMealsFromLs()
localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]))
}

// Bu funksiya localStorege dagi malumotlarni olib return qilib beradi 
getMealsFromLs=()=>{
const mealIds= JSON.parse(localStorage.getItem('mealIds'));
return mealIds === null ? [] : mealIds
}

console.log();
// Bu funksiya parametrida kelayotgan idni localStoregedagi Arraydan filtir qilib qoganini Localga set qiladi 
removeMealFromLs=(mealId)=>{
const mealIds= getMealsFromLs()

localStorage.setItem('mealIds',JSON.stringify(mealIds.filter(id=>id!==mealId)))
}


async function fetchFavMeals() {
    
  favoriteContainer.innerHTML = "";

  const mealIds= getMealsFromLs() //=>[2,3,2,4,3,]
  for(let i=0;i<mealIds.length;i++){
   const mealId =mealIds[i]
    meal = await getMealById(mealId)
  
    addMealToFav(meal)
    
  }


}

fetchFavMeals();



addMealToFav = (mealData) => {



  
    const favMeal = document.createElement('li')

  favMeal.innerHTML = `

         <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
         <button class='close'>
         <i class="fa-solid fa-rectangle-xmark"></i>
         </button>
         `;

  const btn = favMeal.querySelector('.close')

  btn.addEventListener('click', () => {
    removeMealFromLs(mealData.idMeal)

    fetchFavMeals()

  })

  favoriteContainer.appendChild(favMeal)

}
  



function updateMealInfo(mealData) {

  const mealEl = document.createElement('div')


  mealEl.innerHTML`
   <h1>meal title</h1>
          <img src="https://www.themealdb.com/images/media/meals/xxrxux1503070723.jpg" alt="">
        
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, eaque explicabo. Nesciunt eveniet cum nobis obcaecati, odio sed asperiores quidem?</p>
          <ul>
            <li>ing 1 /measure</li>
            <li>ing 2 /measure</li>
            <li>ing 3 /measure</li>
          </ul>
  `


  mealInfoEl.appendChild(mealEl)
mealPopup.classList.remove('hidden')


}





searchBtn.addEventListener('click', async () => {
  const search = searchTerm.value;
  
  const meals =  await getMealBySearch(search)
  mealsEl.innerHTML=''
  if (meals) {
    
    meals.forEach(meal => {
      addMeal(meal)
      
    });
  } else {
    mealsEl.innerHTML=`<h4>Can not find ${search}</h4>`  
  }
})

popupCloseBtn.addEventListener('click',()=> {
  // mealPopup.classList.add('hidden')
})
