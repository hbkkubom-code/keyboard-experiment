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
  { label:"a", x:90, y:90, w:70, h:70 },
  { label:"i", x:10, y:90, w:70, h:70 },
  { label:"u", x:90, y:170, w:70, h:70 },
  { label:"e", x:10, y:10, w:70, h:70 },
  { label:"o", x:90, y:10, w:70, h:70 },

  { label:"k", x:340, y:10, w:70, h:70 },
  { label:"s", x:340, y:170, w:70, h:70 },
  { label:"t", x:260, y:90, w:70, h:70 },
  { label:"n", x:340, y:90, w:70, h:70 },
  { label:"h", x:260, y:10, w:70, h:70 },
  { label:"m", x:260, y:170, w:70, h:70 },
  { label:"y", x:420, y:170, w:70, h:70 },
  { label:"r", x:420, y:90, w:70, h:70 },
  { label:"w", x:180, y:170, w:70, h:70 },
  { label:"g", x:180, y:10, w:70, h:70 },
  { label:"z", x:180, y:90, w:70, h:70 },
  { label:"d", x:420, y:10, w:70, h:70 },
  { label:"b", x:500, y:90, w:70, h:70 },
  { label:"p", x:500, y:170, w:70, h:70 },
  { label:"x", x:10, y:170, w:70, h:70 },

  { label:"-、。!?", x:580, y:170, w:70, h:70 },
  { label:"back", x:500, y:10, w:70, h:70 },
  { label:"space", x:580, y:10, w:70, h:70 },
  { label: "enter", x: 580, y: 90, w: 70, h: 70}
];

const layoutA = [
  {label:"a", x:10, y:90, w:55, h:70},
  {label:"i", x:406, y:10, w:55, h:70},
  {label:"u", x:345, y:10, w:55, h:70},
  {label:"e", x:101, y:10, w:55, h:70},
  {label:"o", x:467, y:10, w:55, h:70},
  {label:"k", x:437, y:90, w:55, h:70},
  {label:"s", x:71, y:90, w:55, h:70},
  {label:"t", x:223, y:10, w:55, h:70},
  {label:"n", x:406, y:170, w:55, h:70},
  {label:"h", x:315, y:90, w:55, h:70},
  {label:"m", x:467, y:170, w:55, h:70},
  {label:"y", x:284, y:10, w:55, h:70},
  {label:"r", x:162, y:10, w:55, h:70},
  {label:"w", x:40, y:10, w:55, h:70},
  {label:"g", x:254, y:90, w:55, h:70},
  {label:"z", x:40, y:170, w:55, h:70},
  {label:"d", x:132, y:90, w:55, h:70},
  {label:"b", x:345, y:170, w:55, h:70},
  {label:"p", x:528, y:10, w:55, h:70},
  {label:"x", x:101, y:170, w:55, h:70},
  {label:"-、。!?", x:528, y:170, w:55, h:70},
  {label:"back", x:589, y:10, w:55, h:70},
  {label:"space", x:589, y:170, w:55, h:70},
  {label:"enter", x:589, y:90, w:55, h:70}
];

const layoutB = [
  {label:"a", x:10, y:90, w:70, h:70},
  {label:"i", x:90, y:90, w:70, h:70},
  {label:"u", x:90, y:10, w:70, h:70},
  {label:"e", x:10, y:10, w:70, h:70},
  {label:"o", x:90, y:170, w:70, h:70},
  {label:"k", x:500, y:90, w:70, h:70},
  {label:"s", x:180, y:90, w:70, h:70},
  {label:"t", x:340, y:10, w:70, h:70},
  {label:"n", x:340, y:170, w:70, h:70},
  {label:"h", x:420, y:90, w:70, h:70},
  {label:"m", x:420, y:170, w:70, h:70},
  {label:"y", x:420, y:10, w:70, h:70},
  {label:"r", x:260, y:10, w:70, h:70},
  {label:"w", x:180, y:10, w:70, h:70},
  {label:"g", x:340, y:90, w:70, h:70},
  {label:"z", x:180, y:170, w:70, h:70},
  {label:"d", x:260, y:90, w:70, h:70},
  {label:"b", x:260, y:170, w:70, h:70},
  {label:"p", x:500, y:170, w:70, h:70},
  {label:"x", x:10, y:170, w:70, h:70},
  {label:"-、。!?", x:580, y:170, w:70, h:70},
  {label:"back", x:500, y:10, w:70, h:70},
  {label:"space", x:580, y:10, w:70, h:70},
  {label:"enter", x:580, y:90, w:70, h:70}
];

const layoutC = [
  {label:"a", x:90, y:90, w:70, h:70},
  {label:"i", x:10, y:90, w:70, h:70},
  {label:"u", x:10, y:10, w:70, h:70},
  {label:"e", x:90, y:170, w:70, h:70},
  {label:"o", x:90, y:10, w:70, h:70},
  {label:"k", x:340, y:90, w:70, h:70},
  {label:"s", x:420, y:90, w:70, h:70},
  {label:"t", x:260, y:90, w:70, h:70},
  {label:"n", x:180, y:90, w:70, h:70},
  {label:"h", x:180, y:10, w:70, h:70},
  {label:"m", x:260, y:10, w:70, h:70},
  {label:"y", x:420, y:10, w:70, h:70},
  {label:"r", x:500, y:90, w:70, h:70},
  {label:"w", x:260, y:170, w:70, h:70},
  {label:"g", x:180, y:170, w:70, h:70},
  {label:"z", x:340, y:170, w:70, h:70},
  {label:"d", x:340, y:10, w:70, h:70},
  {label:"b", x:420, y:170, w:70, h:70},
  {label:"p", x:500, y:170, w:70, h:70},
  {label:"x", x:10, y:170, w:70, h:70},
  {label:"-、。!?", x:580, y:170, w:70, h:70},
  {label:"back", x:500, y:10, w:70, h:70},
  {label:"space", x:580, y:10, w:70, h:70},
  {label:"enter", x:580, y:90, w:70, h:70}
];

/* ===== 保存済み配置 ===== */
const savedLayouts = {
  "円形": keys.map(k => ({ ...k })),
  "qwerty": layoutA,
  "左右分け": layoutB,
  "横並び": layoutC
};

/* ===== プルダウンで配置を切り替える ===== */

const layoutSelect = document.getElementById("layoutSelect");

layoutSelect.addEventListener("change", () => {
  const selectedLayout = savedLayouts[layoutSelect.value];

  if (!selectedLayout) {
    alert("配置データが見つかりません");
    return;
  }

  keys.forEach(k => {
    const saved = selectedLayout.find(s => s.label === k.label);

    if (!saved) return;

    k.x = saved.x;
    k.y = saved.y;
    k.w = saved.w;
    k.h = saved.h;
  });

  selectedKey = null;
  render();
});

const BASE_WIDTH = 660;

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
  pa:"ぱ", pi:"ぴ", pu:"ぷ", pe:"ぺ", po:"ぽ",
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
        const coordinateScale = keyboard.clientWidth / BASE_WIDTH;
        k.x += (nx - sx) / coordinateScale;
        k.y += (ny - sy) / coordinateScale;
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

  const padding = 10;

  const totalHeight = maxBottom + padding;

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

/* ===== 配置データ読み込み ===== */

const layoutInput = document.getElementById("layoutInput");
const importLayoutBtn = document.getElementById("importLayoutBtn");

importLayoutBtn.onclick = () => {

  const csv = layoutInput.value.trim();

  if (!csv) {
    alert("配置データを入力してください");
    return;
  }

  const lines = csv.split(/\r?\n/);

  // ヘッダーを確認
  if (lines[0].trim() !== "label,x,y,w,h") {
    alert("CSVの形式が正しくありません");
    return;
  }

  const newLayout = new Map();

  // 2行目以降を読み込む
  for (let i = 1; i < lines.length; i++) {

    if (!lines[i].trim()) continue;

    const values = lines[i].split(",");

    if (values.length !== 5) {
      alert(`${i + 1}行目の形式が正しくありません`);
      return;
    }

    const [label, x, y, w, h] = values;

    const key = keys.find(k => k.label === label);

    if (!key || newLayout.has(label)) {
      alert(`${i + 1}行目のキー名が不正です`);
      return;
    }

    const position = {
      x: Number(x),
      y: Number(y),
      w: Number(w),
      h: Number(h)
    };

    if (
      !Object.values(position).every(Number.isFinite) ||
      position.w <= 0 ||
      position.h <= 0
    ) {
      alert(`${i + 1}行目の座標やサイズが不正です`);
      return;
    }

    newLayout.set(label, position);
  }

  // すべてのキーが含まれているか確認
  if (newLayout.size !== keys.length) {
    alert("すべてのキーの配置データが必要です");
    return;
  }

  // 配置を反映
  keys.forEach(k => {
    const position = newLayout.get(k.label);

    k.x = position.x;
    k.y = position.y;
    k.w = position.w;
    k.h = position.h;
  });

  selectedKey = null;
  updateSizePanel();
  render();

  alert("配置を読み込みました！");
  showKeyboardScreen();
};

/* ===== 画面切り替え ===== */

const keyboardScreen = document.getElementById("keyboardScreen");
const csvScreen = document.getElementById("csvScreen");

const openImportBtn = document.getElementById("openImportBtn");
const cancelImportBtn = document.getElementById("cancelImportBtn");

function showCsvScreen() {
  keyboardScreen.style.display = "none";
  csvScreen.style.display = "block";
  sizePanel.style.display = "none";
}

function showKeyboardScreen() {
  csvScreen.style.display = "none";
  keyboardScreen.style.display = "block";
  sizePanel.style.display = editMode ? "block" : "none";
  render();
}

openImportBtn.onclick = showCsvScreen;

cancelImportBtn.onclick = showKeyboardScreen;

/* 初期描画 */
applyModeUI();
render();

// 画面サイズが変わったらキーを再配置
window.addEventListener("resize", () => {
  render();
});
