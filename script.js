window.onload = function(e){
  function turtleFact() {
    alert("Some turtles can live longer than humans");
  }

  // turtleFact();

  function temptGang(gangName) {
    alert(gangName + " Come out and play!")
  }

  function addNumbers(num1, num2) {
    alert(num1+num2)
  }

  // addNumbers(10, 5);

  function square(number) {
    return number * number;
  }

  function displaySquare(squaredNumber) {
    console.log("Your number is " + squaredNumber);
  }

  // displaySquare(square(3));

  var pageNode = document.getElementsByTagName('body')[0];
  pageNode.innerHTML += '<h1>Oh Noes!</h1> <p>I just changed the whole page!</p>'

  var title = document.getElementById('open-title');
  title.innerHTML = "Thanks for attending class!";
}


