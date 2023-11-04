function randomize(number) {
    let randomValue = Math.round(Math.random() * number);
    return randomValue;
  }

function calculate(dividend, divider) {
 return Math.round(dividend - Math.floor(dividend / divider) * divider);
}

  
function generateCpf() {
    let hasDots = false;
    let cpf
    
    let n = 9;
    let n1 = randomize(n);
    let n2 = randomize(n);
    let n3 = randomize(n);
    let n4 = randomize(n);
    let n5 = randomize(n);
    let n6 = randomize(n);
    let n7 = randomize(n);
    let n8 = randomize(n);
    let n9 = randomize(n);
    
    let d1 = n9 * 2 + n8 * 3 + n7 * 4 +
             n6 * 5 + n5 * 6 + n4 * 7 +
             n3 * 8 + n2 * 9 +n1 * 10;
    d1 = 11 - calculate(d1, 11);
    if (d1 >= 10) d1 = 0;

    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + 
        n7 * 5 + n6 * 6 + n5 * 7 + 
        n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;

    d2 = 11 - calculate(d2, 11);
    if (d2 >= 10) d2 = 0;
    const retorno = "";
    if (hasDots)
        cpf =
        "" +
        n1 +
        n2 +
        n3 +
        "." +
        n4 +
        n5 +
        n6 +
        "." +
        n7 +
        n8 +
        n9 +
        "-" +
        d1 +
        d2;
    else cpf = "" + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9 + d1 + d2;
    
    return cpf;
}
    

export default generateCpf