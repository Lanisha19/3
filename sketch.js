var dog, dogImg, happyDog;
var database;
var foodS, foodStock;

var feedPet, addFd;
var foodObj;
var lastFed, fedTime;

var gameState = "hungry";
var gameStateRef;

var gardenImg, bedRoomImg, washRoomImg;

var currentTime;

function preload()
{
  dogImg = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");

  gardenImg = loadImage("garden.png");
  bedRoomImg = loadImage("bedRoom.png");
  washRoomImg = loadImage("washRoom.png");
}

function setup() {
	createCanvas(1000, 450);
  database = firebase.database();
  foodStock = database.ref("Food");
  foodStock.on("value", readStock);



  dog = createSprite(750, 250, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodObj = new Food();

  fedTime = database.ref("FeedTime");
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  gameStateRef = database.ref('gameState');
  gameStateRef.on("value", function(data){
  gameState = data.val();
  });

  addFd=createButton("Add Food");
  addFd.position(600, 30);
  addFd.mousePressed(addFood);

  feedPet=createButton("Feed The Dog");
  feedPet.position(500, 30);
  feedPet.mousePressed(feedDog);

  console.log("dateTime");

}


function draw() {  
  

  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedRoom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washRoom();
  }else{
   update("hungry");
   foodObj.display();
  }

  if(gameState!=="hungry"){
     addFd.hide();
     feedPet.hide();
     dog.remove();

  }else{
    addFd.show();
    feedPet.show();
    dog.addImage(dogImg);
  }

  drawSprites();
  
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  });
}

function addFood(){
  foodS+=1;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
};
