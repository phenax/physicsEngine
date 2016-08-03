
import { AwesomeGame } from './AwesomeGame';



const canvas= document.getElementById('game');

canvas.width= 400;
canvas.height= 400;

const game= new AwesomeGame({
    canvas
});

game.start();
