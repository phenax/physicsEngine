
import { AwesomeGame } from './AwesomeGame';



const canvas= document.getElementById('game');



const game= new AwesomeGame({
    canvas
});

game.start();
