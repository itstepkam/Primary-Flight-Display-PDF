//      sSSs    sSSSSs
//      d %% SP   d %%%% SP
//      d % S'    d%S'
//      S %| S % S
//      S & S     S & S
//      Y & Ss    S & S
//          `S&&S   S&S       
//        `S * S  S & S sSSs
//      l * S  S * b`S%%  
//        .S*P  S*S   S%  
//      sSS*S    SS_sSSS  
//      YSS'      Y~YSSY  
//                                          sg free 
//                                          tg - https://t.me/HelloThisIsCapybara
//  sSSs   .S_sSSs      sSSs    sSSs  
// d%%SP  .SS~YS%%b    d%%SP   d%%SP  
//d%S'    S%S   `S % b  d % S'    d%S'
//S % S     S % S    S % S  S % S     S % S
//S & S     S % S    d * S  S & S     S & S
//S & S_Ss  S & S.S * S  S & S_Ss  S & S_Ss
//S & S~SP  S & S_sdSSS   S & S~SP  S & S~SP
//S & S     S & S~YSY % b   S & S     S & S
//S * b     S * S   `S%b  S*b     S*b
//S*S     S*S    S%S  S*S.    S*S.
//S*S     S*S    S&S   SSSbs   SSSbs
//S*S     S*S    SSS    YSSP    YSSP
//SP      SP
//Y       Y






input.onButtonPressed(Button.A, function () {
    // Сигнал для PAN, PAN
    for (let i = 0; i < 2; i++) {
        music.playTone(Note.E5, music.beat(BeatFraction.Half));
        basic.pause(200);
    }
});

input.onButtonPressed(Button.B, function () {
    // Сигнал для MAYDAY, MAYDAY
    for (let i = 0; i < 2; i++) {
        music.playTone(Note.C5, music.beat(BeatFraction.Whole));
        music.playTone(Note.G4, music.beat(BeatFraction.Whole));
        basic.pause(400);
    }
});

input.onButtonPressed(Button.AB, function () {
    // Сигнал для SÉCURITÉ
    music.playTone(Note.G3, music.beat(BeatFraction.Double));
    basic.pause(400);
});

let timeDown = 0; // Таймер для наклона вниз
let timeUp = 0;   // Таймер для наклона вверх

basic.forever(function () {
    // Получаем углы тангажа и крена
    let pitch = input.rotation(Rotation.Pitch); // Вперед/назад
    let roll = input.rotation(Rotation.Roll);  // Влево/вправо

    // Проверяем вертикальное положение
    if (Math.abs(pitch) < 10 && Math.abs(roll) < 10) {
        // Устройство ровное, отображаем горизонтальную линию
        basic.clearScreen();
        for (let x = 0; x < 5; x++) {
            led.plot(x, 2); // Линия по центру
        }
        // Сбрасываем таймеры
        timeDown = 0;
        timeUp = 0;
    } else {
        // Очищаем экран
        basic.clearScreen();

        // Рисуем наклоненную линию
        let centerRow = Math.map(pitch, -90, 90, 0, 4);
        let centerColumn = Math.map(roll, -90, 90, 0, 4);
        centerRow = Math.clamp(0, 4, Math.round(centerRow));
        centerColumn = Math.clamp(0, 4, Math.round(centerColumn));
        for (let x = 0; x < 5; x++) {
            let row = centerRow + (x - 2) * (centerColumn - 2) / 2;
            row = Math.clamp(0, 4, Math.round(row));
            led.plot(x, row);
        }

        // Проверяем наклон вниз (тангаж больше 45°)
        if (pitch > 45) {
            timeDown += 100; // Увеличиваем таймер
            if (timeDown >= 5000) {
                // Проигрываем "Pull Up" сигнал
                for (let i = 0; i < 3; i++) {
                    music.playTone(Note.C5, music.beat(BeatFraction.Quarter));
                    basic.pause(100);
                }
                timeDown = 0; // Сбрасываем таймер
            }
        } else {
            timeDown = 0; // Сбрасываем, если устройство не наклонено
        }

        // Проверяем наклон вверх (тангаж меньше -45°)
        if (pitch < -45) {
            timeUp += 100; // Увеличиваем таймер
            if (timeUp >= 5000) {
                // Проигрываем "Roll" сигнал
                for (let i = 0; i < 3; i++) {
                    music.playTone(Note.G3, music.beat(BeatFraction.Half));
                    basic.pause(200);
                }
                timeUp = 0; // Сбрасываем таймер
            }
        } else {
            timeUp = 0; // Сбрасываем, если устройство не наклонено
        }
    }

    basic.pause(100); // Задержка цикла
});

//      Hello From Ukraine!