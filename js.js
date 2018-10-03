//  Firebase
var config = {
    apiKey: "AIzaSyBWVuF2sTejKHI4I654eino1LSzBuvSSIo",
    authDomain: "train-timers-4ea66.firebaseapp.com",
    databaseURL: "https://train-timers-4ea66.firebaseio.com/",
    storageBucket: "train-timers-4ea66.appspot.com"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // User input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirst = moment($("#first-input").val().trim(), "HHmm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates "temporary" object for train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      first: trainFirst,
      frequency: trainFrequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Log to console 
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);
  
    alert("train successfully added");
  
    // Clears userinput text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-input").val("");
    $("#frequency-input").val("");
  });
  
  // Create Firebase event for adding train
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;
  
    // train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFirst);
    console.log(trainFrequency);
  
    // Prettify the first train data and add am and pm

    var ampm 
        if (trainFirst["HH"] >= 12) {
        ampm = "pm"
        }
        else ampm = "am";

    var trainFirstAmPm = moment.unix(trainFirst).format("hh:mm" + ampm);
        


    // Calculate Next Arrival
    
    // Assumptions
    //var trainFrequency = 3;

    // Time is 3:30 AM
    //var trainFirst = "03:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var trainFirstConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
    console.log(trainFirstConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
  
    // Create new row for data
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFirstAmPm),
      $("<td>").text(trainFrequency),
      $("<td>").text(moment(nextTrain).format("hh:mm"))
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });