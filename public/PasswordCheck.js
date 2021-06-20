function showpassword(){
    const pass = document.getElementById('InputPassword');
    if(pass.type === 'password')
    {
      pass.type = "text"
    }
    else
    {
      pass.type = 'password'
    }
   }

  function readSingleFile(e) {
    const name = e[0].name;
    document.getElementById("file-label").textContent = name;
  }
  // function changeText() {
  // 	document.getElementById("").textContent = name;
  // }