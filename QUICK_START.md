# 빠른 시작 가이드

## 🚀 로컬에서 실행하기

### 1단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
touch .env.local
```

`.env.local` 파일에 다음 내용을 추가하고, Supabase 프로젝트의 실제 값으로 변경하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Supabase 값 찾는 방법:**
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택 → Settings → API
3. Project URL과 API keys 복사

### 2단계: Supabase 데이터베이스 설정

1. Supabase 대시보드에서 **SQL Editor** 열기
2. `supabase/migrations/20240101000000_initial_schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣고 **Run** 클릭
4. 성공 메시지 확인

### 3단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 4단계: 확인 사항

- ✅ 메인 페이지가 로드되는지
- ✅ 매장 목록이 표시되는지 (한남체인, Hmart, 코스트코)
- ✅ 구독 페이지(`/subscribe`) 접속 가능한지

---

## 📦 Vercel 배포하기

### 1단계: GitHub에 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2단계: Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. **Add New Project** 클릭
3. GitHub 저장소 선택 (`siro-wteam/thisweek-deals`)
4. **Import** 클릭

### 3단계: 환경 변수 설정

Vercel 프로젝트 설정에서 **Environment Variables**에 다음 추가:

- `NEXT_PUBLIC_SUPABASE_URL` = (Supabase Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Supabase anon key)
- `SUPABASE_SERVICE_ROLE_KEY` = (Supabase service_role key)

### 4단계: 배포

1. **Deploy** 버튼 클릭
2. 배포 완료 대기 (약 2-3분)
3. 배포된 URL 확인

### 5단계: Supabase 인증 설정 업데이트

Supabase 대시보드에서:
1. **Authentication** → **URL Configuration**
2. **Site URL**을 Vercel 배포 URL로 변경
3. **Redirect URLs**에 Vercel URL 추가

---

## 🐛 문제 해결

### 환경 변수 오류
```bash
# .env.local 파일 확인
cat .env.local

# 서버 재시작
# Ctrl+C로 중지 후
npm run dev
```

### 데이터베이스 연결 오류
- Supabase 프로젝트가 활성화되어 있는지 확인
- API 키가 올바른지 확인
- RLS 정책이 올바르게 설정되었는지 확인

### 빌드 오류
```bash
rm -rf .next node_modules
npm install
npm run build
```

