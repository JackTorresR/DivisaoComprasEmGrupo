@echo off

setlocal enabledelayedexpansion

color 0A

title Divisor de Compras - Build e Deploy

set "NODE_REQUIRED=20.20.1"
set "PROJECT_ROOT=%~dp0.."

cd /d "%PROJECT_ROOT%"

echo ==========================================
echo     DIVISOR DE COMPRAS - PUBLICACAO
echo ==========================================
echo.

REM =====================================================
REM Verificar Node
REM =====================================================

echo [1/4] Verificando Node...

set "NODE_CURRENT="

for /f "delims=v" %%i in ('node -v 2^>nul') do (
    set "NODE_CURRENT=%%i"
)

if not defined NODE_CURRENT (
    echo.
    echo [ERRO] Node.js nao encontrado.
    echo Instale o Node.js ou o NVM antes de continuar.
    echo.
    pause
    exit /b 1
)

echo  Atual: %NODE_CURRENT%
echo  Necessario: %NODE_REQUIRED%

if /I "%NODE_CURRENT%"=="%NODE_REQUIRED%" (
    echo  [OK] Node correto.
) else (
    echo.
    echo  Node %NODE_REQUIRED% necessario.

    where nvm >nul 2>nul

    if errorlevel 1 (
        echo.
        echo [ERRO] NVM nao encontrado.
        echo Instale o NVM para poder alterar automaticamente
        echo a versao do Node.
        echo.
        pause
        exit /b 1
    )

    echo  Verificando instalacao do Node %NODE_REQUIRED%...

    nvm list | find "%NODE_REQUIRED%" >nul

    if errorlevel 1 (
        echo  Instalando Node %NODE_REQUIRED%...

        call nvm install %NODE_REQUIRED%

        if errorlevel 1 (
            echo.
            echo [ERRO] Falha ao instalar Node %NODE_REQUIRED%.
            echo.
            pause
            exit /b 1
        )
    )

    echo  Alterando versao do Node...

    call nvm use %NODE_REQUIRED%

    if errorlevel 1 (
        echo.
        echo [ERRO] Falha ao trocar para o Node %NODE_REQUIRED%.
        echo.
        pause
        exit /b 1
    )

    echo  [OK] Node alterado.
)

echo.

REM =====================================================
REM Verificar dependencias
REM =====================================================

echo [2/4] Verificando dependencias...

if not exist "%PROJECT_ROOT%\node_modules" (
    echo  node_modules nao encontrado.
    echo  Instalando dependencias...

    call npm install

    if errorlevel 1 (
        echo.
        echo [ERRO] Falha ao instalar as dependencias.
        echo.
        pause
        exit /b 1
    )

    echo  [OK] Dependencias instaladas.
) else (
    echo  [OK] Dependencias ja instaladas.
)

echo.

REM =====================================================
REM Build
REM =====================================================

echo [3/4] Gerando build de producao...

if exist "%PROJECT_ROOT%\dist" (
    echo  Removendo build anterior...
    rmdir /s /q "%PROJECT_ROOT%\dist"
)

call npm run build

if errorlevel 1 (
    echo.
    echo ==========================================
    echo [ERRO] BUILD FALHOU!
    echo ==========================================
    echo.
    echo O deploy nao sera executado.
    echo.
    pause
    exit /b 1
)

echo.
echo  [OK] Build gerado com sucesso.
echo.

REM =====================================================
REM Deploy
REM =====================================================

echo [4/4] Publicando no GitHub Pages...

call npm run deploy

if errorlevel 1 (
    echo.
    echo ==========================================
    echo [ERRO] DEPLOY FALHOU!
    echo ==========================================
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo     PUBLICACAO ENVIADA COM SUCESSO!
echo ==========================================
echo.
echo Site deploys:
echo https://github.com/JackTorresR/DivisaoComprasEmGrupo/deployments
echo.
echo Site final:
echo https://jacktorresr.github.io/DivisaoComprasEmGrupo
echo.

pause

exit