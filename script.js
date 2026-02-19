/* ===== モード ===== */
let editMode = false;

/* ===== ローマ字バッファ・途中英字入力目視用 ===== */
let confirmedText = "";
let romajiBuffer = "";

let measuring = false;
let logData = [];

/* ===== 記号用 ===== */
const symbolList = ["ー", "、", "。", "！", "？"];
let symbolIndex = 0;

let symbolTimer = null;
const SYMBOL_RESET_TIME = 500;
let symbolActive = false;

/* ===== 編集モード中サイズ詳細変更用 ===== */
let selectedKey = null;

/* ===== キー配置（backspace追加） ===== */
const keys = [
  { label:"a", x:30, y:20, w:52, h:52 },
  { label:"i", x:100, y:20, w:52, h:52 },
  { label:"u", x:30, y:90, w:52, h:52 },
  { label:"e", x:100, y:90, w:52, h:52 },
  { label:"o", x:30, y:160, w:52, h:52 },

  { label:"k", x:465, y:20, w:52, h:52 },
  { label:"s", x:325, y:20, w:52, h:52 },
  { label:"t", x:395, y:20, w:52, h:52 },
  { label:"n", x:325, y:160, w:52, h:52 },
  { label:"h", x:395, y:90, w:52, h:52 },
  { label:"m", x:185, y:160, w:52, h:52 },
  { label:"y", x:325, y:90, w:52, h:52 },
  { label:"r", x:465, y:90, w:52, h:52 },
  { label:"w", x:255, y:90, w:52, h:52 },
  { label:"g", x:255, y:20, w:52, h:52 },
  { label:"z", x:185, y:90, w:52, h:52 },
  { label:"d", x:395, y:160, w:52, h:52 },
  { label:"b", x:255, y:160, w:52, h:52 },
  { label:"p", x:185, y:20, w:52, h:52 },
  { label:"x", x:100, y:160, w:52, h:52 },

  { label:"-、。!?", x:465, y:160, w:52, h:52 },
  { label:"back", x:535, y:20, w:70, h:52 },
  { label:"space", x:535, y:90, w:70, h:52 },
  { label: "enter", x: 535, y: 160, w: 70, h: 52}
];
const BASE_WIDTH = 600;

const keyboard = document.getElementById("keyboard");
const textArea = document.getElementById("textArea");
const modeBtn = document.getElementById("modeBtn");
const exportLayoutBtn = document.getElementById("exportLayoutBtn");
exportLayoutBtn.onclick = () => {

  // ヘッダー行を作る（Excel用）
  let csv = "label,x,y,w,h\n";

  // 各キーのデータを1行ずつ追加
  keys.forEach(k => {
    csv += `${k.label},${k.x},${k.y},${k.w},${k.h}\n`;
  });

  // textareaに表示
  textArea.value = csv;
};

const startMeasureBtn = document.getElementById("startMeasureBtn");
const stopMeasureBtn = document.getElementById("stopMeasureBtn");

startMeasureBtn.onclick = () => {
  alert("測定開始");
};

stopMeasureBtn.onclick = () => {
  alert("測定終了");
};

/* ===== ローマ字→かな ===== */
const kanaMap = {
  a:"あ", i:"い", u:"う", e:"え", o:"お",
  ka:"か", ki:"き", ku:"く", ke:"け", ko:"こ",
  sa:"さ", si:"し", shi:"し", su:"す", se:"せ", so:"そ",
  ta:"た", ti:"ち", tu:"つ", tsu:"つ", te:"て", to:"と",
  na:"な", ni:"に", nu:"ぬ", ne:"ね", no:"の",
  ha:"は", hi:"ひ", hu:"ふ", he:"へ", ho:"ほ",
  ma:"ま", mi:"み", mu:"む", me:"め", mo:"も",
  ya:"や", yu:"ゆ", yo:"よ", 
  ra:"ら", ri:"り", ru:"る", re:"れ", ro:"ろ",
  wa:"わ", wi:"うぃ", wo:"を", we:"うえ", nn:"ん",
  ga:"が", gi:"ぎ", gu:"ぐ", ge:"げ", go:"ご",
  za:"ざ", zi:"じ", zu:"ず", ze:"ぜ", zo:"ぞ",
  da:"だ", di:"ぢ", du:"づ", de:"で", do:"ど",
  ba:"ば", bi:"び", bu:"ぶ", be:"べ", bo:"ぼ",
  pa:"は", pi:"ひ", pu:"ふ", pe:"へ", po:"ほ",
  kya:"きゃ", kyi:"きぃ", kyu:"きゅ", kye:"きぇ", kyo:"きょ",
  sya:"しゃ", syi:"しぃ", syu:"しゅ", sye:"しぇ", syo:"しょ",
  tya:"ちゃ", tyi:"ちぃ", tyu:"ちゅ", tye:"ちぇ", tyo:"ちょ",
  nya:"にゃ", nyi:"にぃ", nyu:"にゅ", nye:"にぇ", nyo:"にょ",
  hya:"ひゃ", hyi:"ひぃ", hyu:"ひゅ", hye:"ひぇ", hyo:"ひょ",
  mya:"みゃ", myi:"みぃ", myu:"みゅ", mye:"みぇ", myo:"みょ",
  rya:"りゃ", ryi:"りぃ", ryu:"りゅ", rye:"りぇ", ryo:"りょ",
  gya:"ぎゃ", gyi:"ぎぃ", gyu:"ぎゅ", gye:"ぎぇ", gyo:"ぎょ",
  zya:"じゃ", zyi:"じぃ", zyu:"じゅ", zye:"じぇ", zyo:"じょ",
  dya:"ぢゃ", dyi:"ぢぃ", dyu:"ぢゅ", dye:"ぢぇ", dyo:"ぢょ",
  bya:"びゃ", byi:"びぃ", byu:"びゅ", bye:"びぇ", byo:"びょ",
  pya:"ぴゃ", pyi:"ぴぃ", pyu:"ぴゅ", pye:"ぴぇ", pyo:"ぴょ",
  kka:"っか", kki:"っき", kku:"っく", kke:"っけ", kko:"っこ",
  ssa:"っさ", ssi:"っし", ssu:"っす", sse:"っせ", sso:"っそ",
  tta:"った", tti:"っち", ttu:"っつ", tte:"って", tto:"っと",
  hha:"っは", hhi:"っひ", hhu:"っふ", hhe:"っへ", hho:"っほ",
  mma:"っま", mmi:"っみ", mmu:"っむ", mme:"っめ", mmo:"っも",
  yya:"っや", yyu:"っゆ", yyo:"っよ",
  rra:"っら", rri:"っり", rru:"っる", rre:"っれ", rro:"っろ",
  wwa:"っわ", wwu:"っを",
  gga:"っが", ggi:"っぎ", ggu:"っぐ", gge:"っげ", ggo:"っご",
  zza:"っざ", zzi:"っじ", zzu:"っず", zze:"っぜ", zzo:"っぞ",
  dda:"っだ", ddi:"っぢ", ddu:"っづ", dde:"っで", ddo:"っど",
  bba:"っば", bbi:"っび", bbu:"っぶ", bbe:"っべ", bbo:"っぼ",
  ppa:"っば", ppi:"っび", ppu:"っぶ", ppe:"っべ", ppo:"っぼ",
  kkya:"っきゃ", kkyi:"っきぃ", kkyu:"っきゅ", kkye:"っきぇ", kkyo:"っきょ",
  ssya:"っしゃ", ssyi:"っしぃ", ssyu:"っしゅ", ssye:"っしぇ", ssyo:"っしょ",
  ttya:"っちゃ", ttyi:"っちぃ", ttyu:"っちゅ", ttye:"っちぇ", ttyo:"っちょ",
  nnya:"っにゃ", nnyi:"っみぃ", nnyu:"っにゅ", mmye:"っみぇ", nnyo:"っにょ",
  hhya:"っひゃ", hhyi:"っひぃ", hnyu:"っひゅ", hhye:"っひぇ", hnyo:"っひょ",
  mmya:"っみゃ", mmyi:"っみぃ", mmyu:"っみゅ", mmye:"っみぇ", mmyo:"っみょ",
  rrya:"っりゃ", rryi:"っりぃ", rryu:"っりゅ", rrye:"っりぇ", rryo:"っりょ",
  ggya:"っぎゃ", ggyi:"っぎぃ", ggyu:"っぎゅ", ggye:"っぎぇ", ggyo:"っぎょ",
  zzya:"っじゃ", zzyi:"っじぃ", zzyu:"っじゅ", zzye:"っじぇ", zzyo:"っじょ",
  ddya:"っぢゃ", ddyi:"っぢぃ", ddyu:"っぢゅ", ddye:"っぢぇ", ddyo:"っぢょ",
  bbya:"っびゃ", bbyi:"っびぃ", bbyu:"っびゅ", bbye:"っびぇ", bbyo:"っびょ",
  ppya:"っぴゃ", ppyi:"っぴぃ", ppyu:"っぴゅ", ppye:"っぴぇ", ppyo:"っぴょ",
  xa:"ぁ", xi:"ぃ", xu:"ぅ", xe:"ぇ", xo:"ぉ",
  xtu:"っ", 
  xya:"ゃ", xyu:"ゅ", xyo:"ょ",
  xwa:"ゎ",
};

/* ===== 入力処理 ===== */
function handleInput(ch){
  romajiBuffer += ch;

  // ===== 子音連続チェック =====
  if(
    romajiBuffer.length >= 2 &&
    romajiBuffer[0] === romajiBuffer[1] &&
    !["a","i","u","e","o","n"].includes(romajiBuffer[0])
  ){
    confirmedText += "っ";
    romajiBuffer = romajiBuffer.slice(1);
  }

  // ===== 3→2→1文字で変換 =====
  for(let len = 3; len >= 1; len--){
    const part = romajiBuffer.slice(0, len);
    if(kanaMap[part]){
      confirmedText += kanaMap[part];
      romajiBuffer = romajiBuffer.slice(len);
      break; // ← return じゃなく break！
    }
  }

  // ===== nn対応 =====
  if(romajiBuffer === "nn"){
    confirmedText += "ん";
    romajiBuffer = "";
  }

  textArea.value = confirmedText + romajiBuffer;

  // ===== これ以上かなにならない場合 =====
  let canBeConverted = false;

  for(const key in kanaMap){
    if(key.startsWith(romajiBuffer)){
      canBeConverted = true;
      break;
    }
  
  }

  if(!canBeConverted && romajiBuffer.length > 0){
    confirmedText += romajiBuffer[0];
    romajiBuffer = romajiBuffer.slice(1);
  }
}

// ===== 光らせる =====
function flashKey(keyElement){
  keyElement.classList.add("active");
  setTimeout(() => {
    keyElement.classList.remove("active");
  }, 100);
}
/* ===== 記号入力 ===== */
function handleSymbol(){

  if(symbolTimer){
    clearTimeout(symbolTimer);
  }

  if(symbolActive){
    confirmedText = confirmedText.slice(0, -1);
  }

  confirmedText += symbolList[symbolIndex];

  symbolIndex = (symbolIndex + 1) % symbolList.length;
  symbolActive = true;

  textArea.value = confirmedText + romajiBuffer;

  symbolTimer = setTimeout(()=>{
    symbolIndex = 0;
    symbolActive = false;
    symbolTimer = null;
  }, SYMBOL_RESET_TIME);
}

function handleBackspace(){
  if(romajiBuffer.length > 0){
    romajiBuffer = romajiBuffer.slice(0, -1);
  }else if(confirmedText.length > 0){
    confirmedText = confirmedText.slice(0, -1);
  }

  textArea.value = confirmedText + romajiBuffer;
}

/* ===== 編集中選択キー表示 ===== */
function updateSizePanel() {
  if (!selectedKey) return;

  document.getElementById("keyLabel").textContent = selectedKey.label;
  document.getElementById("keyWidth").value = Math.round(selectedKey.w);
  document.getElementById("keyHeight").value = Math.round(selectedKey.h);
  document.getElementById("keyX").value = Math.round(selectedKey.x);
  document.getElementById("keyY").value = Math.round(selectedKey.y);
}

/* ===== 描画 ===== */
function render(){
  keyboard.innerHTML = "";

  keys.forEach(k => {
    const el = document.createElement("div");
    el.className = "key";

    el.textContent =
      k.label==="space" ? "␣" :
      k.label==="back" ? "⌫" :
      k.label==="enter" ? "⏎" :
      k.label;

const scale = keyboard.clientWidth / BASE_WIDTH;

    el.style.left = k.x * scale + "px";
    el.style.top = k.y * scale + "px";
    el.style.width = k.w * scale + "px";
    el.style.height = k.h * scale + "px";

    if (k === selectedKey) {
      el.classList.add("selected");
     }


    /* ===== 入力モード ===== */
    el.addEventListener("click", ()=>{
      console.log(editMode);

    /* ===== 編集モードなら選択だけする ===== */
      if(editMode){
     selectedKey = k;
      updateSizePanel();
      render();
      return;
    }

    /* ===== 入力モード ===== */
    flashKey(el);

  if(k.label==="space"){
    if(romajiBuffer.length > 0){
    confirmedText += romajiBuffer;
    romajiBuffer = "";
    }
    confirmedText += " ";
    textArea.value = confirmedText + romajiBuffer;
  }else if(k.label==="back"){
    handleBackspace();
  }else if(k.label==="enter"){
    if(romajiBuffer.length > 0){
    confirmedText += romajiBuffer;
    romajiBuffer = "";
    }
    confirmedText += "\n";
   textArea.value = confirmedText + romajiBuffer;
  }else if(k.label==="-、。!?"){
    handleSymbol();
  }else{
  handleInput(k.label);
  }
});


    /* ===== 編集モード（ドラッグ＆ピンチ） ===== */
    let sx, sy, startDist, startW, startH;

    el.addEventListener("touchstart", e => {
      if (!editMode) return;

      selectedKey = k;
      updateSizePanel();

      if (e.touches.length === 1) {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      }

      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        startDist = Math.hypot(dx, dy);
        startW = k.w;
        startH = k.h;
      }
    });

    el.addEventListener("touchmove", e => {
      if (!editMode) return;
      e.preventDefault();

      if (e.touches.length === 1) {
        const nx = e.touches[0].clientX;
        const ny = e.touches[0].clientY;
        k.x += nx - sx;
        k.y += ny - sy;
        sx = nx;
        sy = ny;
        updateSizePanel();
        render();
      }

      if (e.touches.length === 2 && startDist) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scale = dist / startDist;

        k.w = startW * scale;
        k.h = startH * scale;

        updateSizePanel();
        render();
      }
    });

    keyboard.appendChild(el);
  });
   updateKeyboardHeight();
}

function updateKeyboardHeight(){
  const keyElements = document.querySelectorAll(".key");

  let minTop = Infinity;
  let maxBottom = 0;

  keyElements.forEach(el => {
    const top = el.offsetTop;
    const bottom = el.offsetTop + el.offsetHeight;

    if(top < minTop) minTop = top;
    if(bottom > maxBottom) maxBottom = bottom;
  });

  const padding = 20; // ← ここが余白

  const totalHeight = (maxBottom - minTop) + padding * 2;

  keyboard.style.height = totalHeight + "px";
}


/* ===== モード切替 ===== */
const sizePanel = document.getElementById("sizePanel");

modeBtn.addEventListener("click", () => {
  editMode = !editMode;

  // 入力モードになったら選択解除
  if (!editMode) {
    selectedKey = null;
  }

  modeBtn.textContent = editMode ? "編集モード" : "入力モード";
  sizePanel.style.display = editMode ? "block" : "none";

  render(); // ← これ重要（再描画）
});

/* ===== 編集中・高さ幅入力 ===== */
document.getElementById("keyWidth").addEventListener("input", e => {
  if (!selectedKey) return;
  selectedKey.w = Number(e.target.value);
  render();
});

document.getElementById("keyHeight").addEventListener("input", e => {
  if (!selectedKey) return;
  selectedKey.h = Number(e.target.value);
  render();
});

document.getElementById("keyX").addEventListener("input", e => {
  if (!selectedKey) return;
  selectedKey.x = Number(e.target.value);
  render();
});

document.getElementById("keyY").addEventListener("input", e => {
  if (!selectedKey) return;
  selectedKey.y = Number(e.target.value);
  render();
});

function applyModeUI(){
  modeBtn.textContent = editMode ? "編集モード" : "入力モード";
  sizePanel.style.display = editMode ? "block" : "none";

}

/* 初期描画 */
applyModeUI();
render();

