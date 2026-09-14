const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
}

const form = document.querySelector('#application-form');
const status = document.querySelector('#form-status');
const mobileCta = document.querySelector('.mobile-cta');
const applySection = document.querySelector('#apply');

const updateMobileCta = () => {
  const rect = applySection.getBoundingClientRect();
  const applyIsVisible = rect.top < window.innerHeight && rect.bottom > 0;
  mobileCta.classList.toggle('is-hidden', applyIsVisible || form.contains(document.activeElement));
};

new IntersectionObserver(updateMobileCta, { threshold: 0.02 }).observe(applySection);
form.addEventListener('focusin', updateMobileCta);
form.addEventListener('focusout', () => requestAnimationFrame(updateMobileCta));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = '';
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = '필수 항목과 개인정보 수집·이용 동의를 확인해 주세요.';
    return;
  }
  status.textContent = '현재 신청 접수 준비 중입니다. 문의는 권현임 교육팀장(010-5795-8075)에게 부탁드립니다.';
});

const modal = document.querySelector('#privacy-modal');
document.querySelector('[data-modal-open]').addEventListener('click', () => modal.showModal());
document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => modal.close()));
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
