const API_BASE = "https://test-revi.onrender.com"; // ← 実際のバックエンドURLに変更

async function loadReviews(club) {
  const container = document.getElementById("review-container");
  if (!container) return;  // レビュー用コンテナがない紹介ページでもエラーにならないよう

  try {
    const res = await fetch(`${API_BASE}/${club}`);
    const reviews = await res.json();
    container.innerHTML = "";

    reviews.forEach(r => {
      const div = document.createElement("div");
      div.classList.add("review");
      div.innerHTML = `
        <div class="name">${r.name}</div>
        <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <div class="comment">${r.comment}</div>
      `;
      // 編集・削除ボタンを入れたい場合は、条件付きでここに追加
      container.appendChild(div);
    });
  } catch (err) {
    console.error("レビュー取得失敗", err);
    container.innerHTML = "<p>レビューの読み込みに失敗しました。</p>";
  }
}

async function submitReview(club) {
  const name = document.getElementById("nameInput")?.value.trim();
  const comment = document.getElementById("commentInput")?.value.trim();
  const rating = Number(document.querySelector("input[name='rating']:checked")?.value);

  if (!name || !comment || !rating) {
    alert("お名前・感想・評価をすべて入力してください。");
    return;
  }

  try {
    await fetch(`${API_BASE}/${club}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, comment, rating })
    });
    document.getElementById("commentForm").reset();
    loadReviews(club);
  } catch (err) {
    console.error("レビュー投稿失敗", err);
    alert("投稿に失敗しました。");
  }
}

