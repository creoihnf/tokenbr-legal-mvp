import { NextRequest, NextResponse } from 'next/server';

interface FormSubmission {
  userType?: string;
  cnpj?: string;
  razaoSocial?: string;
  faturamento?: string;
  setor?: string;
  nome?: string;
  cpf?: string;
  renda?: string;
  perfilRisco?: string;
  email?: string;
  timestamp?: string;
  simulation?: any;
  analytics?: any;
}

export async function POST(request: NextRequest) {
  try {
    const data: FormSubmission = await request.json();
    
    if (!data.email || !data.userType) {
      return NextResponse.json(
        { error: 'Email e tipo de usuário são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('📝 Novo formulário recebido:', {
      userType: data.userType,
      email: data.email,
      timestamp: data.timestamp,
      hasSimulation: !!data.simulation
    });

    if (process.env.FORM_WEBHOOK_URL) {
      try {
        await fetch(process.env.FORM_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        console.log('✅ Dados enviados para webhook');
      } catch (error) {
        console.error('❌ Erro ao enviar para webhook:', error);
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Dados recebidos com sucesso!',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro geral na API:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Tente novamente em alguns instantes'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    service: 'TokenBR Legal API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}