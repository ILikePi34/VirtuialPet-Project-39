var dog, database, foodS, foodStock;
var dog_img, dog_img1;
var food, fedTime, lastFed, feed, addFood;
var change_gs, read_gs, currentTime;
var bedroom_img, garden_img, washroom_img;

function preload(){
  Dog_img = loadImage('Dog.png');
  happy_dog_img = loadImage('happy dog.png')
}

function setup(){
  createCanvas(1000, 500);

  food = new Food();

  dog = createSprite(750, 300, 10, 10);
  dog.addImage(dog_img);
  dog.scale = 0.2;

  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed The Dog");
  feed.position(1000, 75);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(900, 75);
  addFood.mousePressed(addFoods);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  read_gs = database.ref('gameState');
  read_gs.on("value",function(data){
    gameState = data.val();
  });
}

function draw(){
  background(46, 139, 87);

  currentTime = hour();

  if(currentTime == (lastFed + 1)){
    update("Playing");
    food.garden();
   }

  else if(currentTime == (lastFed + 2)){
    update("Sleeping");
    food.bedroom();
  }
   
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    food.washroom();
  } 
   
  else {
    update("Hungry")
    food.display();
  }
   
  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
   
  else{
    feed.show();
    addFood.show();
    dog.addImage(dog_img);
  }

  textSize(20);
  fill ("black");
  if(lastFed >= 12){
    text("Last Fed: "+ lastFed % 12 + " PM", 350, 45);
  }
  
  else if(lastFed==0){
    text("Last Fed: 12 AM", 350, 45);
  }
  
  else{
    text("Last Fed: "+ lastFed + " AM", 350, 45);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dog_img1);

  food.updateFoodStock(food.getFoodStock() - 1);
  database.ref('/').update({
    Food: food.getFoodStock(),
    FeedTime: hour(),
    gameState: "Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}