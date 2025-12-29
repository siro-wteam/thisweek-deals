# 로컬 개발 환경 설정 가이드

## 1. Supabase 프로젝트 생성 및 설정

### Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름 입력 (예: thisweek-deals)
4. 데이터베이스 비밀번호 설정
5. 리전 선택 (가까운 리전 선택)
6. 프로젝트 생성 대기 (약 2분)

### Supabase 설정 값 가져오기
1. 프로젝트 대시보드에서 "Settings" → "API" 메뉴로 이동
2. 다음 값들을 복사:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 사용
   - **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 사용
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY`에 사용 (주의: 이 키는 서버에서만 사용)

### 환경 변수 설정
`.env.local` 파일을 열고 위에서 복사한 값들로 업데이트:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 2. 데이터베이스 마이그레이션 실행

### 방법 1: Supabase 대시보드 사용 (권장)
1. Supabase 대시보드에서 "SQL Editor" 메뉴로 이동
2. "New query" 클릭
3. `supabase/migrations/20240101000000_initial_schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭
5. 성공 메시지 확인

### 방법 2: Supabase CLI 사용
```bash
# Supabase CLI 설치 (아직 설치하지 않은 경우)
npm install -g supabase

# Supabase 로그인
supabase login

# 원격 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

## 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 4. 테스트

### 확인 사항:
- ✅ 메인 페이지가 정상적으로 로드되는지
- ✅ 매장 목록이 표시되는지 (한남체인, Hmart, 코스트코)
- ✅ 구독 페이지가 정상적으로 작동하는지
- ✅ 구독 생성/수정이 가능한지

### 초기 데이터 확인:
Supabase 대시보드의 "Table Editor"에서 `stores` 테이블에 3개의 매장이 자동으로 생성되었는지 확인하세요.

## 5. 문제 해결

### 환경 변수 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 값이 올바르게 설정되었는지 확인
- 서버를 재시작하세요 (`Ctrl+C` 후 `npm run dev`)

### 데이터베이스 연결 오류
- Supabase 프로젝트가 활성화되어 있는지 확인
- API 키가 올바른지 확인
- RLS (Row Level Security) 정책이 올바르게 설정되었는지 확인

### 빌드 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

