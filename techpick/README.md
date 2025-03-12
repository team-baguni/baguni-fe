## 테스트 환경 설정
1. 의존성을 설치합니다. (이 때 폴더가 techpick인 것을 확인해주세요)
```
yarn
```
2. playwright 브라우저를 설치합니다. window 환경일 경우 백신이 설치를 막을 수 있으니 따로 조치를 취해주세요.
```
yarn playwright install
```
3. `env.example`을 참조해서 환경변수를 주입해주세요.
4. `package.json`에 명세된 방식으로 script를 실행하면 됩니다. ex) `yarn test:e2e`, `yarn test:ui`
5. login의 경우 /dev/login으로 들어가주세요.