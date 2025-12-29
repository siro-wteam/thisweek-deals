# 이번주 세일 (ThisWeek Deals)

남캘리포니아에 거주하는 한인을 위한 구독형 세일 정보 서비스입니다. 한남체인, Hmart, 코스트코의 이번주 세일 정보를 제공합니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Styling**: Custom CSS

## 주요 기능

- 🛒 매장별 세일 정보 조회
- 📧 이메일 구독 서비스
- 🏪 한남체인, Hmart, 코스트코 세일 정보 제공
- 📱 반응형 웹 디자인

## 프로젝트 구조

```
thisweek-deals/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── deals/         # 세일 정보 API
│   │   ├── stores/        # 매장 정보 API
│   │   └── subscriptions/ # 구독 관리 API
│   ├── subscribe/         # 구독 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── lib/
│   └── supabase/          # Supabase 클라이언트
│       ├── client.ts      # 브라우저 클라이언트
│       └── server.ts      # 서버 클라이언트
├── supabase/
│   ├── migrations/        # 데이터베이스 마이그레이션
│   └── config.toml        # Supabase 설정
└── package.json
```

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/siro-wteam/thisweek-deals.git
cd thisweek-deals
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 URL과 API 키 확인
3. Supabase CLI로 마이그레이션 실행:

```bash
supabase db push
```

또는 Supabase 대시보드에서 SQL 에디터를 사용하여 `supabase/migrations/20240101000000_initial_schema.sql` 파일의 내용을 실행하세요.

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. 배포 완료!

## 데이터베이스 스키마

### Stores (매장)
- `id`: UUID
- `name`: 매장 이름
- `slug`: URL 슬러그
- `website_url`: 웹사이트 URL
- `logo_url`: 로고 이미지 URL
- `region`: 지역 (기본값: 'southern-california')

### Deals (세일 정보)
- `id`: UUID
- `store_id`: 매장 ID (외래키)
- `title`: 세일 제목
- `description`: 설명
- `original_price`: 원가
- `sale_price`: 세일 가격
- `discount_percentage`: 할인율
- `image_url`: 이미지 URL
- `product_url`: 상품 페이지 URL
- `category`: 카테고리
- `valid_from`: 유효 시작일
- `valid_to`: 유효 종료일
- `is_active`: 활성화 여부

### Subscriptions (구독)
- `id`: UUID
- `user_id`: 사용자 ID (외래키)
- `email`: 이메일 주소
- `store_preferences`: 선호 매장 목록
- `notification_preference`: 알림 주기 (daily/weekly/biweekly)
- `is_active`: 활성화 여부

## 세일 정보 수집

세일 정보는 `/api/deals/collect` 엔드포인트를 통해 수집할 수 있습니다. 각 매장의 웹사이트에서 세일 정보를 크롤링하거나 API를 통해 가져와서 이 엔드포인트로 전송하면 됩니다.

예시:

```javascript
const response = await fetch('/api/deals/collect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    store_id: 'store-uuid',
    deals: [
      {
        title: '세일 상품명',
        description: '상품 설명',
        original_price: 100,
        sale_price: 80,
        discount_percentage: 20,
        image_url: 'https://...',
        product_url: 'https://...',
        category: '식품',
        valid_from: '2024-01-01',
        valid_to: '2024-01-07',
      },
    ],
  }),
})
```

## 라이선스

MIT

## 기여

이슈와 풀 리퀘스트를 환영합니다!

