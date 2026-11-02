
document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".garden .item");
  const secretApple = document.getElementById("secretApple");

  let appleCount = 0;
  const requiredCount = 15;
  let cleared = false;

  // 全アイコンにタップ操作を設定
  items.forEach((item) => {

    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");

    function tapItem() {

      if (cleared) return;

      // タップ時のアニメーション
      item.classList.remove("tapped");
      void item.offsetWidth;
      item.classList.add("tapped");

      if (item === secretApple) {

        // リンゴをタップした場合
        appleCount++;

        if (appleCount >= requiredCount) {

          cleared = true;

          // 15回連続で隠しページへ
          setTimeout(() => {
            window.location.href = "secret.html";
          }, 350);

        }

      } else {

        // リンゴ以外をタップしたらリセット
        appleCount = 0;

      }
    }

    // スマホ・PCでのタップ
    item.addEventListener("click", tapItem);

    // キーボード操作
    item.addEventListener("keydown", (event) => {

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        tapItem();
      }

    });

    item.addEventListener("animationend", () => {
      item.classList.remove("tapped");
    });

  });

});
