'use client';

import React, { useState } from 'react';
import { Building2, Plus, Trash2, Loader2 } from 'lucide-react';
import { useBoards, useDeleteBoard, useCreateBoard } from '@/lib/query/hooks/useBoardsQuery';
import { BoardCreationWizard } from '@/features/boards/components/BoardCreationWizard';
import type { Board } from '@/types';

export const UnidadesNegocioManager: React.FC = () => {
  const { data: boards = [], isLoading } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleCreate = (boardData: Omit<Board, 'id' | 'createdAt'>, order?: number) => {
    createBoard.mutate({ board: boardData, order });
    setWizardOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta unidade de negócio?')) return;
    deleteBoard.mutate(id);
  };

  return (
    <div className="pb-10">
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Unidades de Negócio</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Gerencie seus pipelines por área de atuação (Vendas, Suporte, Marketing, etc.).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Criar Unidade
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">Nenhuma unidade de negócio</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Crie unidades de negócio para organizar seus canais e conversas por área (Vendas, Suporte, Marketing, etc.).
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {boards.map((board) => (
              <div
                key={board.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: board.color || '#0ea5e9' }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{board.name}</p>
                    {board.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{board.description}</p>
                    )}
                  </div>
                  {board.isDefault && (
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium">
                      Padrão
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(board.id)}
                  disabled={deleteBoard.isPending}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50 shrink-0 ml-3"
                  title="Excluir unidade"
                >
                  {deleteBoard.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {wizardOpen && (
        <BoardCreationWizard
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onCreate={handleCreate}
          onOpenCustomModal={() => setWizardOpen(false)}
        />
      )}
    </div>
  );
};
